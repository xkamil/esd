import React from 'react';

function Service(props) {
  const {service, isVisible, onClick} = props;

  const serviceStatus = service.health?.statusOk ? 'statusOk' : 'statusFail';
  const visibility = isVisible ? '' : 'hidden';
  const statusLine = service.health?.statusOk ? '' : (service.health?.statusCode || service.health?.error);
  const serviceVersion = getServiceVersion(service);

  return (
    <div className={`serviceBox ${serviceStatus} ${visibility}`} onClick={onClick}>
      <div className='serviceName'>{service?.name}
        <div className='statusLabel'>{statusLine === 'OK' ? '' : statusLine}</div>
      </div>
      <div className='serviceVersion'>
        {serviceVersion}
      </div>
    </div>
  )
}

function getServiceVersion(service) {
  return service.health?.body?.applicationVersion
    || service.meta?.body?.maven?.version
    || service.meta?.body?.build?.tag
    || ''
}

export default Service;






