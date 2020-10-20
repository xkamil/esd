import React, {useState} from 'react';
import ServiceBox from "./ServiceBox";
import {mapServiceHealthStatus, mapServiceMetaStatus} from "./Utils";

function Dashboard(props) {
  const {config} = props;
  const [filter, setFilter] = useState('');
  const [details, setDetails] = useState(null);

  const isVisible = (serviceName) => {
    return serviceName.toLowerCase().indexOf(filter.toLowerCase()) > -1;
  }

  return (
    <div>
      <h1>{config.environment} environment</h1>
      <input className='filterInput' onChange={e => setFilter(e.target.value)} value={filter}/>

      {details && <ServiceDetailsModal service={details} onClick={() => setDetails(null)}/>}

      <div className="servicesContainer">
        {Object.getOwnPropertyNames(config.services)
          .map(serviceName => <ServiceBox
            onClick={() => setDetails(config.services[serviceName])}
            serviceName={serviceName}
            isVisible={isVisible(serviceName)}
            service={config.services[serviceName]}/>)
        }
      </div>
    </div>
  )
}

function ServiceDetailsModal(props) {
  const {service, onClick} = props;

  return (
    <div className='serviceDetailsModal' onClick={onClick}>
      <div className='detailsBox'>
        <div className={mapServiceHealthStatus(service)}>
          <span>GET {service.healthUrl}</span>
          <span>{service.health.status}</span>
        </div>
        <pre>{JSON.stringify(service.health.body, null, 2)}</pre>
      </div>
      <div className='detailsBox'>
        <div className={mapServiceMetaStatus(service)}>
          <span>GET {service.metaUrl}</span>
          <span>{service.meta.status}</span>
        </div>
        <pre>{JSON.stringify(service.meta.body, null, 2)}</pre>
      </div>
    </div>
  )

}

export default Dashboard;







