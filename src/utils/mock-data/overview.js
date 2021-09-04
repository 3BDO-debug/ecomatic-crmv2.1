import { Icon } from '@iconify/react';
import { Stack, Avatar, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
// routes
import { mainUrl } from '../../APIs/axios';
// components
import Label from '../../components/Label';

export const ticketsDataCreator = (tickets) => {
  const ticketsData = [];
  tickets.map((ticket) =>
    ticketsData.push({
      id: ticket.ticket_generated_id,
      technician:
        ticket.technician_name !== 'Technician Not Selected Yet' ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={ticket.technician_name} src={`${mainUrl}/${ticket.technician_profile_pic}`} />
            <Typography variant="subtitle2" noWrap>
              {ticket.technician_name}
            </Typography>
          </Stack>
        ) : (
          <Label variant="ghost" color="error">
            Technician Not Selected Yet
          </Label>
        ),
      clientName: ticket.client_name,
      currentStage: ticket.current_stage,
      intializedAt: ticket.created_at,
      action: (
        <Button
          startIcon={<Icon icon="carbon:view" />}
          component={Link}
          to={`/dashboard/tickets/ticket-details/${ticket.id}`}
        />
      )
    })
  );
  return ticketsData;
};
