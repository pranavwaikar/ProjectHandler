import React, { Fragment } from 'react';

const Unauthorize = () => {
  return (
    <Fragment>
      <h1 className="x-large text-primary">
        <i className="fas fa-exclamation-triangle" /> Unauthorized access
      </h1>
      <p className="large">Sorry, this page is not accessible to you!</p>
    </Fragment>
  );
};

export default Unauthorize;
