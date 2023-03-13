import { roundPriceUsd } from "@Utils";
import ExcelJS from "exceljs";
import moment from "moment";
import { getTaxValue } from "../Table/functions";

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
