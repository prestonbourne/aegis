"use client";
import { Button } from "./ui/button";

export const downloadObjectAsJson = (obj: any, filename: string) => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(obj, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

type DownloadButtonProps = {
  children: React.ReactNode;
  filename: string;
  toDownload: any;
};

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  children,
  toDownload,
  filename,
}: DownloadButtonProps) => {
  return (
    <Button onClick={() => downloadObjectAsJson(toDownload, filename)}>
      {children}
    </Button>
  );
};
