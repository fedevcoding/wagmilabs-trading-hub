export const formatLinks = links => {
  if (links && links.length > 0) {
    const temp = links.split(/:\s|,/);
    console.log(temp);
    const res = {};
    temp.map((el, index) => {
      if (index % 2 === 0) {
        return (res[el] = temp[index + 1]);
      }
    });
    return res;
  }
  return null;
};

export const formatEventInfo = (eventInfo, section) => {
  const eventToSave = {};
  if (section !== "personal") {
    eventToSave.timestamp = eventInfo.date.getTime();
    eventToSave.links = formatLinks(eventInfo.links);
  }
  switch (section) {
    case "drops":
      eventToSave.collectionName = eventInfo.name;
      eventToSave.price = eventInfo.price;
      eventToSave.supply = eventInfo.supply;
      break;
    case "events":
      eventToSave.eventName = eventInfo.name;
      eventToSave.eventDescription = eventInfo.eventDescription;
      eventToSave.eventLocation = eventInfo.eventLocation;
      break;
    case "personal":
      eventToSave.event = {
          timestamp: eventInfo.date.getTime(),
          links: formatLinks(eventInfo.links),
          eventName: eventInfo.name,
          eventDescription: eventInfo.eventDescription
        }
      break;
    case "spaces":
      eventToSave.spaceName = eventInfo.name;
      eventToSave.spaceDescrition = eventInfo.eventDescription;
      eventToSave.spaceHost = eventInfo.spaceHost;
      break;
    default:
      break;
  }
  return eventToSave;
};