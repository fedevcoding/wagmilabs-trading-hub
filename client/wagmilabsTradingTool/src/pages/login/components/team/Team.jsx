import React from "react";

import { twitter, linkedin } from "@Assets";

import "./style.scss";

const Team = () => {
  return (
    <div className="team-section">
      <div className="cardsContainer">
        <div className="card">
          <img
            src={"https://wagmilabs.tools/static/media/fede.26f7feb08713b8b480d3.jpg"}
            className="teamImg"
            alt="Wagmi Labs"
          />
          <h1 className="cardName">Federico Cavallini</h1>
          <div className="cardRole">Co-founder, developer & CTO</div>
          <div className="cardDescription">
            15 year old full stack developer & CTO at Wagmi Labs. NFT trader that's been in the crypto and NFT space
            since September 2021 and has been building Wagmi Labs' tech since February 2022.
          </div>

          <div className="cardLinks">
            <a href="https://www.linkedin.com/in/federico-cavallini-7641b424b/" target={"_blank"} rel="noreferrer">
              <img src={linkedin} alt="Wagmi Labs" className="cardsSocialImages" />
            </a>
            <a href="https://twitter.com/NFTfede" target={"_blank"} rel="noreferrer">
              <img src={twitter} alt="Wagmi Labs" className="cardsSocialImages" />
            </a>
          </div>
        </div>
        <div className="card">
          <img
            src={"https://wagmilabs.tools/static/media/mett.16217f241c589f30786c.jpg"}
            className="teamImg"
            alt="Wagmi Labs"
          />
          <h1 className="cardName">Mattia Cavallini</h1>
          <div className="cardRole">Co-founder & CEO</div>
          <div className="cardDescription">
            20 year old entrepreneur & CEO at Wagmi Labs. NFT trader and degen that's been in the crypto and NFT space
            since <br></br>February 2021, actively trading NFTs
            <br /> since September 2021.
          </div>
          <div className="cardLinks">
            <a href="https://www.linkedin.com/in/mattia-cavallini-162337240/" target={"_blank"} rel="noreferrer">
              <img src={linkedin} alt="Wagmi Labs" className="cardsSocialImages" />
            </a>
            <a href="https://twitter.com/mett_eth" target={"_blank"} rel="noreferrer">
              <img src={twitter} alt="Wagmi Labs" className="cardsSocialImages" />
            </a>
          </div>
        </div>
        <div className="card">
          <img
            src={"https://wagmilabs.tools/static/media/vito.1103885eb20e2fac8b2f.jpg"}
            className="teamImg"
            alt="Wagmi Labs"
          />
          <h1 className="cardName">Vito Lattanzi</h1>
          <div className="cardRole">BizDevOps, GTM & Mentor</div>
          <div className="cardDescription">
            Innovation manager with over 25 years of experience in corporate, covering strategic roles in sales and
            marketing, leading to partnerships with startups as a mentor, business angel and VC point of contact.
          </div>

          <div className="cardLinks">
            <a href="https://www.linkedin.com/in/vitolattanzi/  " target={"_blank"} rel="noreferrer">
              <img src={linkedin} alt="Wagmi Labs" className="cardsSocialImages" />
            </a>
          </div>
        </div>
      </div>

      <section className={"investors"}>
        <p className={"partnerTitle"}>OUR PARTNERS</p>
        <div className={"imgContainer"}>
          <a href="https://www.verumcapital.it/" target="_blank" rel="noreferrer">
            <img
              src={"https://wagmilabs.tools/static/media/vc.0d5c9137401a780be28d.png"}
              alt="Wagmi Labs"
              className={"vcImg"}
            />
          </a>
          <a href="https://www.entrepreniston.com/" target="_blank" rel="noreferrer">
            <img
              src={
                "data:image/png;base64,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"
              }
              alt="Wagmi Labs"
              className={"entreprenistonImg"}
            />
          </a>
          <a href="https://www.promoteandscale.com" target="_blank" rel="noreferrer">
            <img
              src={"https://wagmilabs.tools/static/media/luckytrader.30b5019011b1ce6b1c5e.png"}
              alt="Wagmi Labs"
              className={"promotescaleImg"}
            />
          </a>
          <a href="https://mikcosentino.com" target="_blank" rel="noreferrer">
            <img
              src={"https://wagmilabs.tools/static/media/psLogo.62e8eb3b7857532f6ecc.png"}
              alt="Wagmi Labs"
              className={"promotescaleImg"}
            />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Team;
