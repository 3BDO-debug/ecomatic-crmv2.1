import React, { useCallback, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  DialogContent,
  Grid,
  Typography,
  Divider,
  Stack
} from '@material-ui/core';
// context
import { ItemsContext } from '../../../contexts';
// components
import Label from '../../Label';

// ------------------------------------------------
const devicesNotices = {
  slimHob: {
    notice: 'برجاء تجهيز فتحة الرخامة بالمقاسات التالية'
  },
  oven: {
    question: ` هل تم فتح ظهرية الفرن بالكامل ؟ -
     هل تم عمل فتحة التهوية اسفل الفرن ؟ -
     هل تم عمل هواية امامية و ذلك في حالة عدم وجود درج او درفة بدون ظهرية اسفل الفرن`,
    yesNotice: `برجاء ارسال صورة لوحدة الفرن`,
    noNotice: `برجاء تجهيز فتحات التهوية و معاودة الاتصال لتفعيل الأوردر`
  },
  hood: {
    question: `هل يوجد وحدة مطبخ فوق المسطح او البوتجاز`,
    yesNotice: `مراعاة الارتفاع بين الشعلة و بداية الشفاط من اسفل لا تقل عن ٧٠ - ٧٥ سم`,
    noNotice: `مراعاة الارتفاع بين الشعلة و بداية الشفاط من اسفل لا تقل عن ٧٠ - ٧٥ سم`
  },
  cooker: {
    notice: `برجاء عدم فك ارجل البوتجاز (للموديلات ٩٠ سم فقط.)`
  }
};

// ------------------------------------------------

DeviceNotice.propTypes = {
  formik: PropTypes.object,
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func
};

function DeviceNotice({ formik, isTriggered, triggerHandler }) {
  const items = useContext(ItemsContext).itemsState[0];
  const { values } = formik;
  const [notice, setNotice] = useState('');
  const [question, setQuestion] = useState('');
  const [yesNotice, setYesNotice] = useState('');
  const [noNotice, setNoNotice] = useState('');
  /*   const itemFinder = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    return item;
  }; */
  const itemFinder = useCallback(
    (itemId) => {
      const item = items.find((item) => item.id === itemId);
      return item;
    },
    [items]
  );
  useEffect(() => {
    if (values.device) {
      if (itemFinder(values.device).category === 'gas-oven') {
        setQuestion(devicesNotices.oven.question);
        setYesNotice(devicesNotices.oven.yesNotice);
        setNoNotice(devicesNotices.oven.noNotice);
      } else if (itemFinder(values.device).category === 'slim-hob') {
        setNotice(devicesNotices.slimHob.notice);
      } else if (itemFinder(values.device).category === 'hood') {
        setQuestion(devicesNotices.hood.question);
        setYesNotice(devicesNotices.hood.yesNotice);
        setNoNotice(devicesNotices.hood.noNotice);
      } else if (itemFinder(values.device).category === 'cooker') {
        setNotice(devicesNotices.cooker.notice);
      }
    }
  }, [values.device, itemFinder]);
  return (
    <Dialog open={isTriggered} onClose={triggerHandler}>
      <DialogTitle>{question !== '' ? question : 'Notice'}</DialogTitle>
      <Divider sx={{ marginTop: '10px' }} variant="middle" />
      <DialogContent>
        <Box marginTop="30px">
          <Grid container spacing={3}>
            {yesNotice !== '' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" rowGap={3}>
                  <Label variant="ghost" color="success">
                    Yes
                  </Label>
                  <Typography sx={{ marginLeft: '10px' }} variant="body1">
                    {yesNotice}
                  </Typography>
                </Stack>
              </Grid>
            )}
            {noNotice !== '' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" rowGap={3}>
                  <Label variant="ghost" color="error">
                    No
                  </Label>
                  <Typography sx={{ marginLeft: '10px' }} variant="body1">
                    {noNotice}
                  </Typography>
                </Stack>
              </Grid>
            )}
            {notice !== '' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" rowGap={3}>
                  <Label variant="ghost" color="info">
                    Notice
                  </Label>
                  <Typography sx={{ marginLeft: '10px' }} variant="body1">
                    {notice}
                  </Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <Divider variant="middle" sx={{ marginBottom: '10px' }} />
      <DialogActions>
        <Button onClick={triggerHandler} variant="contained">
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeviceNotice;
