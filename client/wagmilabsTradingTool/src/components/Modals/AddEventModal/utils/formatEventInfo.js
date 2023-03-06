const formatLinks = (links) => {
  const res = {};
  links.map((el) => (
    res[el.type] = el.link
  ))
  return res;
};

export const formatEventInfo = (eventInfo, section, links) => {
  const eventToSave = {};
  if (section !== "personal") {
    eventToSave.timestamp = eventInfo.date.getTime();
    eventToSave.links = formatLinks(links);
  }
  switch (section) {
    case "drops":
      eventToSave.collectionName = eventInfo.name;
      eventToSave.eventDescription = eventInfo.eventDescription;
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