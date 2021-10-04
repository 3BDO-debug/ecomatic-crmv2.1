import { Icon } from '@iconify/react';
// material
import { Box, Button, Stack, Tooltip } from '@material-ui/core';
// APIs
import { ticketDeviceServicesFetcher, ticketDeviceSparepartsFetcher } from '../../../APIs/customerService/tickets';
// components
import Label from '../../../components/Label';

export const ticketsDataCreator = (tickets) => {
  const ticketsData = [];

  tickets.map((ticket) =>
    ticketsData.push({
      ticketNumber: ticket.ticket_generated_id,
      id: ticket.id,
      clientFullname: ticket.client_name,
      region: ticket.client_region,
      phoneNumber: ticket.client_phone_number_1,
      ticketStatus: ticket.ticket_status,
      ticketStage: ticket.current_stage,
      technicianName: ticket.technician_name,
      routeName: ticket.route_name,
      overallRating: ticket.overall_rating,

      action: ticket.id
    })
  );
  return ticketsData;
};

async function ticketDeviceSparepartsServices(deviceId) {
  const deviceSparepartsServices = [];
  await ticketDeviceSparepartsFetcher(deviceId)
    .then((deviceSparepartsData) =>
      deviceSparepartsData.map((deviceSparepart) =>
        deviceSparepartsServices.push({
          description: (
            <Label variant="ghost" color="info">
              Sparepart {deviceSparepart.spare_part_model_number}
            </Label>
          ),
          qty: deviceSparepart.required_qty,
          price: deviceSparepart.spare_part_price,
          sum: deviceSparepart.required_qty * deviceSparepart.spare_part_price
        })
      )
    )
    .catch((error) => console.log(error));
  await ticketDeviceServicesFetcher(deviceId)
    .then((deviceServicesData) =>
      deviceServicesData.map((deviceService) =>
        deviceSparepartsServices.push({
          description: (
            <Label variant="ghost" color="info">
              Service {deviceService.service_name}
            </Label>
          ),
          qty: deviceService.required_qty,
          price: deviceService.service_price,
          sum: deviceService.required_qty * deviceService.service_price
        })
      )
    )
    .catch((error) => console.log(error));
  return deviceSparepartsServices;
}

const ticketDeviceActions = (
  translate,
  ticketDevice,
  activeView,
  setTriggeredDevice,
  triggerSparepartsServices,
  triggerDeviceDetails,
  triggerCompleted,
  triggerNotCompleted,
  triggerRedirectTicketDevice
) => {
  const infoButton = (
    <Button
      sx={{ marginLeft: '10px' }}
      onClick={() => {
        setTriggeredDevice(ticketDevice.id);
        triggerDeviceDetails(true);
      }}
      startIcon={<Icon icon="carbon:view" />}
    />
  );

  const technicianStageActions = (
    <Box>
      {ticketDevice.device_ticket_status === 'Under Processing' ? (
        <Box>
          <Button
            onClick={() => {
              setTriggeredDevice(ticketDevice);
              triggerCompleted(true);
            }}
            sx={{ marginRight: '10px' }}
            variant="contained"
          >
            {translate(
              'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.actionButtons.markCompleted'
            )}
          </Button>
          <Button
            onClick={() => {
              setTriggeredDevice(ticketDevice);
              triggerNotCompleted(true);
            }}
            variant="outlined"
            color="error"
          >
            {translate(
              'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.actionButtons.markNotCompleted'
            )}
          </Button>
        </Box>
      ) : (
        <>
          {ticketDevice.device_ticket_status === 'Completed' && (
            <Button
              onClick={() => {
                setTriggeredDevice(ticketDevice);
                triggerCompleted(true);
              }}
              color="info"
              startIcon={<Icon icon="carbon:document" width={20} height={20} />}
            />
          )}
          {ticketDevice.device_ticket_status !== 'Under Processing' && (
            <Tooltip title="redirect to supervisor">
              <Button
                onClick={() => {
                  setTriggeredDevice(ticketDevice);
                  triggerRedirectTicketDevice(true);
                }}
                color="error"
                startIcon={<Icon icon="bi:arrow-return-left" />}
              />
            </Tooltip>
          )}
        </>
      )}
    </Box>
  );

  return (
    <Stack direction="row">
      {activeView === 3 ? (
        technicianStageActions
      ) : (
        <Box component="div">
          {activeView < 2 && (
            <Button
              onClick={() => {
                triggerSparepartsServices(true);
                setTriggeredDevice(ticketDevice.id);
              }}
              variant="outlined"
            >
              {translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.actionButtons.addSparepartsServices'
              )}
            </Button>
          )}
        </Box>
      )}
      {infoButton}
    </Stack>
  );
};

export const ticketDevicesDataCreator = async (
  ticketDetails,
  ticketDevices,
  triggerSparepartsServices,
  setTriggeredDevice,
  triggerDeviceDetails,
  translate,
  currentRole,
  triggerDeviceNotes,
  triggerCompleted,
  triggerNotCompleted,
  triggerRedirectTicketDevice,
  activeView
) => {
  const ticketDevicesData = [];

  const mapper = ticketDevices.map((ticketDevice) =>
    ticketDeviceSparepartsServices(ticketDevice.id).then((deviceSparepartsServices) =>
      ticketDevicesData.push({
        modelNumber: ticketDevice.device_model_number,
        ticketType: (
          <Label variant="ghost" color="primary">
            {ticketDevice.device_ticket_type}
          </Label>
        ),
        ticketStatus: (
          <Label variant="ghost" color="info">
            {ticketDevice.device_ticket_status}
          </Label>
        ),
        notes: (
          <Button
            onClick={() => {
              setTriggeredDevice(ticketDevice);

              triggerDeviceNotes(true);
            }}
            variant="contained"
            startIcon={<Icon icon="ps:important" />}
          >
            {translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.actionButtons.viewNotes')}
          </Button>
        ),
        action: ticketDeviceActions(
          translate,
          ticketDevice,
          activeView,
          setTriggeredDevice,
          triggerSparepartsServices,
          triggerDeviceDetails,
          triggerCompleted,
          triggerNotCompleted,
          triggerRedirectTicketDevice
        ),
        collapsibleRow: true,
        collapsibleContent: {
          title: 'Spareparts & services',
          collapsibleColumnsData: [
            {
              id: 'description',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.description'
              )
            },
            {
              id: 'qty',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.qty'
              )
            },
            {
              id: 'price',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.price'
              )
            },
            {
              id: 'sum',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.sum'
              )
            }
          ],
          collapsibleRowsData: deviceSparepartsServices
        }
      })
    )
  );
  await Promise.all(mapper);
  return ticketDevicesData;
};

/* export const ticketDevicesDataCreator = async (
  ticketDetails,
  ticketDevices,
  triggerSparepartsServices,
  setTriggeredDevice,
  triggerDeviceDetails,
  translate,
  currentRole,
  triggerDeviceNotes
) => {
  const ticketDevicesData = [];
  const mapper = ticketDevices.map((ticketDevice) =>
    ticketDeviceSparepartsServices(ticketDevice.id).then((deviceSparepartsServices) =>
      ticketDevicesData.push({
        modelNumber: ticketDevice.device_model_number,
        ticketType: (
          <Label variant="ghost" color="primary">
            {ticketDevice.device_ticket_type}
          </Label>
        ),
        ticketStatus: (
          <Label variant="ghost" color="info">
            {ticketDevice.device_ticket_status}
          </Label>
        ),
        notes: (
          <Button
            onClick={() => {
              setTriggeredDevice(ticketDevice);

              triggerDeviceNotes(true);
            }}
            variant="contained"
            startIcon={<Icon icon="ps:important" />}
          >
            View notes
          </Button>
        ),
        action: (
          <Box component="div">
            {ticketDetails.current_stage !== 'technician-stage' && (
              <Button
                onClick={() => {
                  triggerSparepartsServices(true);
                  setTriggeredDevice(ticketDevice.id);
                }}
                variant="outlined"
              >
                Add spareparts &amp; services
              </Button>
            )}
            <Button
              sx={{ marginLeft: '10px' }}
              startIcon={<Icon icon="carbon:view" />}
              onClick={() => {
                setTriggeredDevice(ticketDevice.id);
                triggerDeviceDetails(true);
              }}
            />
          </Box>
        ),
        collapsibleRow: true,
        collapsibleContent: {
          title: 'Spareparts & services',
          collapsibleColumnsData: [
            {
              id: 'description',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.description'
              )
            },
            {
              id: 'qty',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.qty'
              )
            },
            {
              id: 'price',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.price'
              )
            },
            {
              id: 'sum',
              label: translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.collapsibleTableColumns.sum'
              )
            }
          ],
          collapsibleRowsData: deviceSparepartsServices
        }
      })
    )
  );
  await Promise.all(mapper);
  return ticketDevicesData;
}; */

export const ticketDetailsDataCreator = (tickets, ticketId) => {
  const ticket = tickets.find((ticket) => ticket.id === parseInt(ticketId, 10));
  return ticket;
};
