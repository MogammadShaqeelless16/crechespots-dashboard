import React from 'react';
import { Link } from 'react-router-dom';
import './CrecheList.css';

const CrecheList = ({ creches, isLoading }) => {
  return (
    <div className="creche-list">
      <h2>My Centre</h2>
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        creches.length > 0 ? (
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
          <div className="loading-container">
          <div className="loading-spinner"></div>
          </div>// Optional message if you want to handle cases with no creches
        )
      )}
    </div>
  );
};

export default CrecheList;
