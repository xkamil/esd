import React from 'react';
import {getServiceVersion, mapServiceHealthStatus} from "./Utils";

function ServiceBox(props) {
  const {serviceName, service, isVisible, onClick} = props;

  const boxClass = 'serviceBox ' + mapServiceHealthStatus(service) + (isVisible ? '' : ' blur');
  const statusLine = service.health.status || service.health.error;
  const serviceVersion = getServiceVersion(service);

  return (
    <div className={boxClass} onClick={onClick}>
      <div className='serviceName'>{serviceName}</div>
      <div className='statusLabel'>{statusLine}</div>
      <div className='serviceVersion'>{serviceVersion}</div>
    </div>
  )
}

export default ServiceBox;







