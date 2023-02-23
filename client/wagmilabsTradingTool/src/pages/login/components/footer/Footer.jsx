import React from "react";
import "./style.scss"

import { www, twitter2, discord2, instructions } from "src/assets";

const Footer = () => {
    return (
        <footer className="login-footer">
            <div className="login-general-links">
                <div className="login-general-links-line"></div>

                <a target="_blank" href="https://wagmilabs.tools" rel="noreferrer">
                    <img src={www} className="login-general-links-img" alt="" />
                </a>
                <a
                    target="_blank"
                    href="https://twitter.com/wagmi_labs"
                    rel="noreferrer"
                >
                    <img src={twitter2} className="login-general-links-img" alt="" />
                </a>
                <a
                    target="_blank"
                    href="https://discord.gg/wagmilabs"
                    rel="noreferrer"
                >
                    <img src={discord2} className="login-general-links-img" alt="" />
                </a>

                <div className="login-general-links-line"></div>
            </div>

            <a className="legal-btn" href="/legal" target={"_blank"}>
                <img className="legal-img" alt="" src={instructions} />
                <div>Legal</div>
            </a>

            <a
                className="instructions-btn"
                href="https://docs.wagmilabs.tools/trading-hub-documentation"
                target={"_blank"}
                rel="noreferrer"
            >
                <img className="instructions-img" alt="" src={instructions} />
                <div>instructions</div>
            </a>
        </footer>
    );
};

export default Footer;
