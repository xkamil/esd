import React from 'react';

function ServiceDetailsModal(props) {
  const {service, onClick} = props;

  if (!service) {
    return <></>
  }

  return (
    <div className='serviceDetailsModal' onClick={onClick}>
      <div className='detailsBox'>
        <div className={service.health?.statusOk ? 'statusOk' : 'statusFail'}>
          <span>{service.healthUrl}</span>
          <span>{service.health?.statusCode}</span>
        </div>
        <pre>{JSON.stringify(service.health?.body, null, 2)}</pre>
      </div>
      <div className='detailsBox'>
        <div className={service.meta?.statusOk ? 'statusOk' : 'statusFail'}>
          <span>{service.metaUrl}</span>
          <span>{service.meta?.statusCode}</span>
        </div>
        <pre>{JSON.stringify(service.meta?.body, null, 2)}</pre>
      </div>
    </div>
  )

}

export default ServiceDetailsModal;







