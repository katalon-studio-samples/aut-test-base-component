import React from 'react';
import { IframeExample } from '../components/IframeExample';
import { IframeComplex } from '../components/IframeComplex';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Stack, AccordionSummary as StyledAccordionSummary } from "@mui/material";
import { styled } from '@mui/material/styles';
import {IFRAME_BASE_URL} from "../data/menuData.ts";

const AccordionSummary = styled(StyledAccordionSummary)(() => ({
  backgroundColor: 'lightgray',
  '&:hover': {
    backgroundColor: 'gray',
  },
  '.MuiTypography-root': {
    fontWeight: 'bold',
  },
}));

export const IframePage: React.FC = () => {
  return (
    <Stack direction="column" spacing={5} className="px-4 py-6 sm:px-0">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Iframe Examples</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <h1 className="text-2xl font-bold mb-6">Iframe Examples</h1>
          <p className="mb-6">
            Practice working with iframes, including nested elements and cross-frame communication.
          </p>
          <IframeExample />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Iframe Complex</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <h1 className="text-2xl font-bold mb-6 mt-10">Iframe Complex</h1>
          <IframeComplex />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Iframe same domain</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <h1 className="text-2xl font-bold mb-6 mt-10">Iframe same domain</h1>
          <div className="border rounded-lg p-4" data-test="iframe-wrapper-educenter">
            <h3 className="text-lg font-medium mb-2">Iframe Center</h3>
            <iframe
              src="https://base-component.aut.katalon.com"
              className="w-full h-[100vh] border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              data-test="iframe-educenter"
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Iframe same domain forms</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="border rounded-lg mt-10" data-test="iframe-wrapper-educenter">
            <h3 className="text-lg font-medium mb-2">Iframe Center</h3>
            <iframe
              src="https://base-component.aut.katalon.com/#/forms"
              className="w-full h-[100vh] border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              data-test="iframe-educenter"
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Iframe same domain tables</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="border rounded-lg p-4 mt-10" data-test="iframe-wrapper-educenter">
            <h3 className="text-lg font-medium mb-2">Iframe Center</h3>
            <iframe
              src="https://base-component.aut.katalon.com/#/tables"
              className="w-full h-[100vh] border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              data-test="iframe-educenter"
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Iframe same domain nested: 1 Level</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="border rounded-lg p-4 mt-10" data-test="iframe-wrapper-educenter">
            <h3 className="text-lg font-medium mb-2">Iframe Center</h3>
            <iframe
              src={`${IFRAME_BASE_URL}/#/iframes-1`}
              className="w-full h-[100vh] border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              data-test="iframe-educenter"
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Iframe different domain</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <h1 className="text-2xl font-bold mb-6 mt-10">Iframe different domain</h1>
          <div className="border rounded-lg p-4" data-test="iframe-wrapper-map">
            <h3 className="text-lg font-medium mb-2">Map</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4567669516946!2d106.67497227580748!3d10.77628565919476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2773aeb38d%3A0x95d6d5e9b6d3bb10!2zMjg1IEjhurttIDI4NSBDw6FjaCBN4bqhbmcgVGjDoW5nIFTDoW0sIFBoxrDhu51uZyAxMiwgUXXhuq1uIDEwLCBI4buTIENow60gTWluaCA3MDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1743431975561!5m2!1svi!2s"
              width="1000"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};