import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popper,
  Box,
  ClickAwayListener,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@mui/icons-material';

export interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
}

interface MultiTieredMenuMUIProps {
  items: MenuItem[];
}

const MultiTieredMenuMUI: React.FC<MultiTieredMenuMUIProps> = ({ items }) => {
  const [hoveredPath, setHoveredPath] = useState<string[]>([]);
  const [anchorEls, setAnchorEls] = useState<(HTMLElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [clickedItemLabel, setClickedItemLabel] = useState<string | null>(null);

  const handleMouseEnter = (itemId: string, level: number, event: React.MouseEvent<HTMLElement>) => {
    const newPath = [...hoveredPath.slice(0, level), itemId];
    setHoveredPath(newPath);
    
    const newAnchorEls = [...anchorEls.slice(0, level)];
    newAnchorEls[level] = event.currentTarget;
    setAnchorEls(newAnchorEls);
  };

  const handleMouseLeave = (level: number) => {
    setHoveredPath(prev => prev.slice(0, level));
    setAnchorEls(prev => prev.slice(0, level));
  };

  const handleClickAway = () => {
    setHoveredPath([]);
    setAnchorEls([]);
  };

  const handleClick = (item: MenuItem) => {
    if (!item.children || item.children.length === 0) {
      setClickedItemLabel(item.label);
      setOpen(true);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isInPath = hoveredPath[level] === item.id;
    const shouldShowChildren = isInPath && hasChildren;
    const anchorEl = anchorEls[level];

    if (level === 0) {
      return (
        <Box
          key={item.id}
          onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => handleMouseEnter(item.id, level, event)}
          onMouseLeave={() => handleMouseLeave(level)}
        >
          <Button
            color="inherit"
            endIcon={hasChildren ? <KeyboardArrowDown /> : undefined}
            onClick={() => handleClick(item)}
            sx={{
              height: '64px',
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {item.label}
          </Button>
          {shouldShowChildren && item.children && (
            <Popper
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              placement="bottom-start"
              sx={{ zIndex: 1300 }}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <Paper elevation={3}>
                  <List sx={{ minWidth: 200 }}>
                    {item.children.map(child => renderMenuItem(child, level + 1))}
                  </List>
                </Paper>
              </ClickAwayListener>
            </Popper>
          )}
        </Box>
      );
    }

    return (
      <ListItem
        key={item.id}
        disablePadding
        onMouseEnter={(event: React.MouseEvent<HTMLLIElement>) => handleMouseEnter(item.id, level, event)}
        onMouseLeave={() => handleMouseLeave(level)}
      >
        <ListItemButton onClick={() => handleClick(item)}>
          <ListItemText primary={item.label} />
          {hasChildren && (
            <IconButton size="small" sx={{ ml: 1 }}>
              <KeyboardArrowRight />
            </IconButton>
          )}
        </ListItemButton>
        {shouldShowChildren && item.children && (
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="right-start"
            sx={{ zIndex: 1300 }}
          >
            <Paper elevation={3}>
              <List sx={{ minWidth: 200 }}>
                {item.children.map(child => renderMenuItem(child, level + 1))}
              </List>
            </Paper>
          </Popper>
        )}
      </ListItem>
    );
  };

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar sx={{ justifyContent: 'start' }}>
          {items.map(item => renderMenuItem(item))}
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Item Clicked</DialogTitle>
        <DialogContent>
          <p>You clicked: {clickedItemLabel}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MultiTieredMenuMUI; 