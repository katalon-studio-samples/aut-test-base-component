import React, { useState } from "react";
import { ConfigProvider, Layout, Menu, Space, theme } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";

const { Header } = Layout;

export interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
}

interface MultiTieredMenuAntdProps {
  items: MenuItem[];
}

const MultiTieredMenuAntd: React.FC<MultiTieredMenuAntdProps> = ({ items }) => {
  const { isDark } = useTheme();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [clickedItemLabel, setClickedItemLabel] = useState<string | null>(null);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const handleMenuClick = (item: MenuItem) => {
    if (!item.children || item.children.length === 0) {
      setClickedItemLabel(item.label);
      setOpen(true);
    }
  };

  const convertToAntdItems = (
    menuItems: MenuItem[],
    level: number = 0,
  ): MenuProps["items"] => {
    return menuItems.map((item) => {
      const hasChildren = item.children && item.children.length > 0;

      if (hasChildren && item.children) {
        const submenu = {
          key: item.id,
          label: (
            <Space>
              {item.label}
              {level === 0 && (
                <CaretDownOutlined style={{ fontSize: "12px" }} />
              )}
            </Space>
          ),
          children: convertToAntdItems(item.children, level + 1),
          onTitleClick: () => handleMenuClick(item),
          style: {
            padding: level === 0 ? "0 20px" : "0 16px",
          },
        };
        return submenu;
      }

      return {
        key: item.id,
        label: item.label,
        onClick: () => handleMenuClick(item),
        style: {
          padding: level === 0 ? "0 20px" : "0 16px",
        },
      };
    });
  };

  const menuStyle: React.CSSProperties = {
    lineHeight: "64px",
  };

  const submenuStyle: MenuProps = {
    items: convertToAntdItems(items),
    mode: "horizontal",
    openKeys,
    onOpenChange: handleOpenChange,
    style: menuStyle,
    triggerSubMenuAction: "hover",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ background: isDark ? "#1f2937" : "#fff" }}>
        <Header
          style={{
            background: isDark ? "#1f2937" : "#fff",
            padding: 0,
            borderBottom: isDark ? "1px solid #4b5563" : "1px solid #f0f0f0",
          }}
        >
          <Menu {...submenuStyle} />
        </Header>
        <Dialog
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                ".dark &": { backgroundColor: "#1f2937", color: "#f9fafb" },
              },
            },
          }}
        >
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
      </Layout>
    </ConfigProvider>
  );
};

export default MultiTieredMenuAntd;
