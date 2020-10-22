import React, {useState} from 'react';
import Service from "./Service";
import ServiceDetailsModal from "./ServiceDetailsModal";

function ServicesContainer(props) {
  const {config} = props;
  const [filter, setFilter] = useState('');
  const [serviceDetails, setServiceDetails] = useState(null);

  const isVisible = (service) => {
    return service.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
  }

  const onServiceClicked = (e, service) => {
    e.stopPropagation();
    setServiceDetails(service)
  }

  const services = config.services.map(service => <Service
    key={service.name}
    onClick={e => onServiceClicked(e, service)}
    isVisible={isVisible(service)}
    service={service}/>)

  return (
    <div className='serviceContainer'>
      <h1>{config.environment.toUpperCase()}</h1>
      <input className='filterInput' onChange={e => setFilter(e.target.value)} value={filter}/>
      <ServiceDetailsModal service={serviceDetails} onClick={() => setServiceDetails(null)}/>

      <div className="servicesContainer">
        {services}
      </div>
    </div>
  )
}

export default ServicesContainer;







