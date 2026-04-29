import React from "react";
import "../../css/Heroagent.css";
import AgentCard from "./AgentCard";

export default function HeroAgent() {
    return (
        <div className="ha-hero">
            <div className="ha-grid-bg"></div>
            <div className="ha-hero-inner">

                <div className="ha-left">
                    <div className="ha-badge">
                        <span className="ha-badge-dot"></span>
                        AI Agent Platform
                    </div>
                    <h1 className="ha-h1">
                      
                        Transform your products,<br/>
                        <em>market them *professionally*</em>,<br/>
                        with AI
                    </h1>
                    <p className="ha-sub">
                       Upload your product photo and let AI turn it into a professional marketing image — with themed visuals and ready-to-use captions in seconds.
                    </p>
                    <div className="ha-actions">
                        
                        <button className="ha-btn-ghost">Start for free</button>
                    </div>
                    <div className="ha-stats">
                        <div className="ha-stat">
                            <span className="ha-stat-num">10x</span>
                            <span className="ha-stat-label">Faster <br/> workflows</span>
                        </div>
                        <div className="ha-stat">
                            <span className="ha-stat-num">4+</span>
                            <span className="ha-stat-label">AI-Powered <br/> Features</span>
                        </div>
                        <div className="ha-stat">
                            <span className="ha-stat-num">99.9%</span>
                            <span className="ha-stat-label">No Design <br/> Skills Needed</span>
                        </div>
                    </div>
                </div>

                <div className="ha-right">
                    <AgentCard />
                </div>

            </div>
        </div>
    );
}