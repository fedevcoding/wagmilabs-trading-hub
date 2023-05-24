import { roundPriceUsd } from "@Utils";
import ExcelJS from "exceljs";
import moment from "moment";
import { bannerPnl } from "@Assets";
import { getTaxValue } from "../Table/functions";
import { formatAddress, roundPrice } from "../../../../utils/formats/formats";
import { pushToServer } from "../../../../utils/functions";

export async function exportData(data, taxedOn, taxPerc, longTermTax) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Profit and loss");
  worksheet.addRow([
    "Contract Address",
    "Token ID",
    "Paid",
    "Sold",
    "Fees",
    "P&L",
    "Hold duration",
    "Gross profit",
    "Taxes owed",
  ]);

  data.forEach(row => {
    const nft = row.info;
    const isMinted = !!row.minted;
    const paid = (isMinted ? roundPriceUsd(nft.gasFees.minted.usd) : nft.paid.usd) + "$";
    const sold = nft.sold.usd + "$";
    const fees = roundPriceUsd(nft.gasFees.total.usd) + "$";
    const pOrL = roundPriceUsd(nft.pOrL.usd) + "$";
    const momentDuration = moment.duration(nft.holdDuration, "seconds").humanize();
    const holdDuration = nft.holdDuration ? momentDuration : nft.holdDuration;
    const gross = roundPriceUsd(nft.gross.usd) + "$";
    const taxes = getTaxValue(nft, taxedOn, "usd", taxPerc, longTermTax);

    worksheet.addRow([nft.nft.address, nft.nft.id, paid, sold, fees, pOrL, holdDuration, gross, taxes]);
  });

  // generate a buffer from the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "data.xlsx");
  document.body.appendChild(link);
  link.click();
}

const avgHodlTime = data => {
  let timeDuration = 0;

  const tradeAmounts = data?.length;
  data.forEach(trade => {
    const holdDuration = trade?.info?.holdDuration;
    timeDuration += holdDuration;
  });
  const avg = (timeDuration / tradeAmounts) * 1000;

  // 5 hours in milliseconds
  const paperHand = 18000000;

  // 7 days in milliseconds
  const flipper = 604800000;

  // 3 months in milliseconds
  const hodler = 7776000000;

  if (avg < paperHand) {
    return "Paper hand 🧻";
  } else if (avg > paperHand && avg < flipper) {
    return "Flipper 🐬";
  } else if (avg > flipper && avg < hodler) {
    return "Hodler 🦍";
  } else {
    return "Diamond hand 💎";
  }
};

const getCtxColor = data => {
  if (data > 0) {
    return "#00FF00";
  } else {
    return "#FF0000";
  }
};

export async function downloadPnlImage(data, paid, sold, pAndL, address, profileImage, { startDate, endDate }) {
  if (!data?.length) return;

  const canvas = document.createElement("canvas");
  canvas.height = 604;
  canvas.width = 528;
  const ctx = canvas.getContext("2d");
  const holdDurationStatus = avgHodlTime(data);
  const status = pAndL?.eth > 0 ? "Winner 👑" : "Loser 📉";

  const banner = new Image();
  const pfp = new Image();

  banner.onload = () => {
    ctx.drawImage(banner, 0, 0);

    ctx.save();
    ctx.beginPath();
    ctx.arc(75, 65, 35, 0, Math.PI * 2, false);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(pfp, 40, 30, 70, 70);
    ctx.restore();

    ctx.font = "25px poppins";
    ctx.fillText(formatAddress(address), 140, 77);

    ctx.fillText(
      `Period: ${moment(startDate).format("MMM DD, YYYY")} - ${moment(endDate).format("MMM DD, YYYY")}`,
      40,
      170
    );

    ctx.fillStyle = getCtxColor(paid?.eth);
    ctx.fillText(`Total spent: ${roundPrice(paid?.eth)} ETH`, 40, 240);

    ctx.fillStyle = getCtxColor(sold?.eth);
    ctx.fillText(`Total sold: ${roundPrice(sold?.eth)} ETH`, 40, 290);

    ctx.fillStyle = getCtxColor(pAndL?.eth);
    ctx.fillText(`Net P&L: ${roundPrice(pAndL?.eth)} ETH`, 40, 340);

    ctx.fillStyle = "black";
    ctx.fillText(`Status: ${status}`, 40, 410);
    ctx.fillText(`HODL: ${holdDurationStatus}`, 40, 460);

    ctx.fillStyle = "white";
    ctx.fillText(`app.wagmilabs.tools`, 135, 560);
    download(canvas, "P&L_wagmilabs.png");
  };
  banner.src = bannerPnl;

  pfp.crossOrigin = "anonymous";
  pfp.src = `${profileImage}.png`;

  await pushToServer("/stats", { type: "pnl_download", timestamp: Date.now(), source: null });
}

function download(canvas, filename) {
  var lnk = document.createElement("a");
  lnk.download = filename;
  lnk.href = canvas.toDataURL("image/png;base64");
  lnk.click();
}
