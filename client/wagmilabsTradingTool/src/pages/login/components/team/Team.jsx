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

      <div></div>
    </div>
  );
};

export default Team;
