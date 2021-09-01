export const closeTicketValidation = async (ticketDevices) => {
  let proceed;
  ticketDevices.some((ticketDevice) => {
    if (ticketDevice.device_ticket_status === 'Under Processing') {
      proceed = false;
    } else {
      proceed = true;
    }
    return proceed;
  });
  return proceed;
};
