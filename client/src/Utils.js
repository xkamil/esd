function mapServiceHealthStatus(service) {
  let mappedStatus;
  if (service.health.status === 'OK') {
    mappedStatus = 'statusOk';
  } else if (!service.health.status && !service.health.error) {
    mappedStatus = 'statusUnknown';
  } else {
    mappedStatus = 'statusFail';
  }
  return mappedStatus;
}

function mapServiceMetaStatus(service) {
  let mappedStatus;
  if (service.meta.status === 'OK') {
    mappedStatus = 'statusOk';
  } else if (!service.meta.status && !service.meta.error) {
    mappedStatus = 'statusUnknown';
  } else {
    mappedStatus = 'statusFail';
  }
  return mappedStatus;
}

function getServiceVersion(service) {
  const getVersion = [
    () => service?.health?.body?.applicationVersion,
    () => service?.meta?.body?.maven?.version,
    () => service?.meta?.body?.build?.tag,
  ];

  for (let i = 0; i < getVersion.length; i++) {
    let version = getVersion[i]();
    if (version) {
      return version;
    }
  }
  return '';
}

export {getServiceVersion, mapServiceHealthStatus, mapServiceMetaStatus}





