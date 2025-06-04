import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export const AlertsPage: React.FC = () => {
  const [lastAction, setLastAction] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleAlert = () => {
    alert("This is a simple alert!");
    setLastAction("Alert shown");
  };

  const handleDialog = () => {
    setDialogOpen(true);
    setLastAction("Dialog Model shown");
  };

  const handleConfirm = () => {
    const result = window.confirm("Do you want to proceed?");
    setLastAction(`Confirm dialog: ${result ? "OK" : "Cancel"}`);
  };

  const handlePrompt = () => {
    const result = window.prompt("Please enter your name:", "");
    setLastAction(`Prompt dialog: ${result ? `"${result}"` : "Cancel"}`);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        JavaScript Alerts
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
        <div>
          <button
            onClick={handleDialog}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            data-test="alert-button"
          >
            Show Dialog Modal
          </button>
        </div>

        <div>
          <button
            onClick={handleAlert}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            data-test="alert-button"
          >
            Show Alert
          </button>
        </div>

        <div>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            data-test="confirm-button"
          >
            Show Confirm
          </button>
        </div>

        <div>
          <button
            onClick={handlePrompt}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            data-test="prompt-button"
          >
            Show Prompt
          </button>
        </div>

        {lastAction && (
          <div
            className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded"
            data-test="result-container"
          >
            <span className="text-gray-900 dark:text-white">
              Last action: {lastAction}
            </span>
          </div>
        )}
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>This is a simple alert!</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setLastAction("Alert shown");
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
