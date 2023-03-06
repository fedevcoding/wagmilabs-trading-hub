import React from "react";

export const Table = ({ section }) => {
  return (
    <div className="table-wrapper">
      <table cellSpacing={0} className="table">
        <thead>
          <tr>
            {section === "active" ? (
              <>
                <th>Collection</th>

                <th>Trigger price</th>

                <th>QT.</th>

                <th>Account</th>

                <th>Status</th>

                <th>Gas</th>

                <th>Action</th>
              </>
            ) : (
              <>
                <th>Collection</th>
                <th>Buy price</th>
                <th>Account</th>
                <th>Status</th>
                <th>Gas</th>
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>

        <tbody></tbody>
      </table>
    </div>
  );
};
