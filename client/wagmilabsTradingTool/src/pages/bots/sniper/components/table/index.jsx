import React from "react";

export const Table = ({ section, activeSnipes }) => {
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

        <tbody>
          {section === "active" &&
            activeSnipes?.map((snipe, index) => {
              const { collectionName, collectionImage, maxPrice, maxAutoBuy, walletAddress, maxPriorityFeePerGas } =
                snipe;
              return (
                <tr key={index}>
                  <td>{collectionName}</td>
                  <td>{maxPrice}</td>
                  <td>{maxAutoBuy}</td>
                  <td>{walletAddress}</td>
                  <td>{"active"}</td>
                  <td>{maxPriorityFeePerGas}</td>
                  <td>
                    <button className="btn btn-danger">Cancel</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
