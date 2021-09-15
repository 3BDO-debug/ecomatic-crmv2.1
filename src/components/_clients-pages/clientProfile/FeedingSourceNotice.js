import React, { useEffect, useState } from 'react';
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
// components
import Label from '../../Label';

// --------------------------------------------
const feedingSourcesNotices = {
  gasCylinder: {
    question: `هل تم تجهيز متطلبات التركيب علي غاز انبوبة`,
    note1: `برجاء تجهيز منظم ايطالي او تركي ببكرة + ٢ افيز نصف بوصه + خرطوم و مشترك حرف T في حالة توصيل اكثر من جهاز علي نفس الانبوبة بالاضافة لعدد ٦ افيز`,
    note2: `برجاء العلم بان ضغط الغاز المقنن للجهاز هو ٣٠ مللي بار ، خلاف ذلك لن يتم تركيب او اعتماد الضمان و سيتم تحصيل رسوم الزيارة`
  },
  naturalGas: {
    question: `هل تم توصيل خراطيم الغاز بالجهاز عن طريق شركة الغاز الطبيعي ؟`,
    note1: `برجاء عدم السماح لفني شركة الغاز الطبيعي بالعبث في الجهاز حيس انه من الممكن ان تتلف الفواني او الحساسات و سيتم تغيرها بتكلفة اضافية `,
    noNote: `برجاء توصيل الغاز مسبقا من خلال شركة الغاز ثم معاودة الاتصال`
  },
  internalExpulsion: {
    note1: `برجاء تغير فلاتر الكربون من 6-12 اشهر او حسب الاستخدام`
  },
  externalExpulsion: {
    note1: `برجاء تجهيز فتحة مدخنة دائرية بقطر ٥ بوصة علي ارتفاع لا يقل عن ٢٢٥ سم من الأرض`,
    note2: `سوستة المدخنة ، سعر المتر ١٠٠ جنية و حسب المسافة من الشفاط و حتة فتحة الطرد`,
    note3: `برجاء العلم بانه كلما زادت المسافة بين الشفاط و فتحة المدخنة قلت كفاءة قدرة الشفاط، المسافة القصوي هي ٤ متر`
  }
};
// --------------------------------------------

FeedingSourceNotice.propTypes = {
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func,
  formik: PropTypes.object
};

function FeedingSourceNotice({ isTriggered, triggerHandler, formik }) {
  const { values } = formik;
  const [question, setQuestion] = useState('');
  const [noNote, setNoNote] = useState('');
  const [note1, setNote1] = useState('');
  const [note2, setNote2] = useState('');
  const [note3, setNote3] = useState('');
  useEffect(() => {
    if (values.feedingSource === 'Natural Gas') {
      setQuestion(feedingSourcesNotices.naturalGas.question);
      setNote1(feedingSourcesNotices.naturalGas.note1);
      setNoNote(feedingSourcesNotices.naturalGas.noNote);
    } else if (values.feedingSource === 'Gas Cylinder') {
      setQuestion(feedingSourcesNotices.gasCylinder.question);
      setNote1(feedingSourcesNotices.gasCylinder.note1);
      setNote2(feedingSourcesNotices.gasCylinder.note2);
    } else if (values.feedingSource === 'Internal Expulsion') {
      setNote1(feedingSourcesNotices.internalExpulsion.note1);
    } else if (values.feedingSource === 'External Expulsion') {
      setNote1(feedingSourcesNotices.externalExpulsion.note1);
      setNote2(feedingSourcesNotices.externalExpulsion.note2);
      setNote3(feedingSourcesNotices.externalExpulsion.note3);
    }
  }, [values.feedingSource]);
  return (
    <Dialog open={isTriggered} onClose={triggerHandler}>
      <DialogTitle>{question !== '' ? question : 'Notice'}</DialogTitle>
      <Divider variant="middle" />
      <DialogContent>
        <Box marginTop="30px">
          <Grid container spacing={3}>
            {note1 !== '' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" rowGap={3}>
                  <Label variant="ghost" color="info">
                    Note
                  </Label>
                  <Typography sx={{ marginLeft: '10px' }}>{note1}</Typography>
                </Stack>
              </Grid>
            )}
            {note2 !== '' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" rowGap={3}>
                  <Label variant="ghost" color="info">
                    Note
                  </Label>
                  <Typography sx={{ marginLeft: '10px' }}>{note2}</Typography>
                </Stack>
              </Grid>
            )}
            {note3 !== '' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" rowGap={3}>
                  <Label variant="ghost" color="info">
                    Note
                  </Label>
                  <Typography sx={{ marginLeft: '10px' }}>{note3}</Typography>
                </Stack>
              </Grid>
            )}
            {noNote !== '' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" rowGap={3}>
                  <Label variant="ghost" color="error">
                    No
                  </Label>
                  <Typography sx={{ marginLeft: '10px' }}>{noNote}</Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={triggerHandler} variant="contained">
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FeedingSourceNotice;
