// CrecheList.js
import React from 'react';
import { Link } from 'react-router-dom';

const CrecheList = ({ creches }) => {
  return (
    <div className="creche-list">
      <h2>My Creche</h2>
      {creches.length > 0 ? (
        creches.map((creche) => (
          <div key={creche.id} className="creche-box">
            <Link to={`/creche/${creche.id}`} className="creche-card">
              {creche.header_image && (
                <img src={creche.header_image} alt={creche.title.rendered} className="creche-card-image" />
              )}
              <div className="creche-card-content">
                <h3 className="creche-card-title">{creche.title.rendered}</h3>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p>No creches available</p>
      )}
    </div>
  );
};

export default CrecheList;
