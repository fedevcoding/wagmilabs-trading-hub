import React from "react";
import "./style.css";

export const Pagination = ({ currentPage, setCurrentPage }) => (
  <nav>
    <ul className="pagination">
      <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
        <button className="page-link" onClick={() => setCurrentPage(1)}>
          <i className="fa-solid fa-step-backward" />
        </button>
      </li>
      <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <i className="fa-solid fa-backward" />
        </button>
      </li>
      <li key={currentPage} className="page-item active">
        <button className="page-link">{currentPage}</button>
      </li>
      <li className={"page-item"}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <i className="fa-solid fa-forward" />
        </button>
      </li>
    </ul>
  </nav>
);
