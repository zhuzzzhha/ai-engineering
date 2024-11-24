import { Box, Button } from "@mui/material";
import { FC, useState } from "react";
import { useLazyCreateModelQuery } from "../../api";

type TFiles = {
  f: string | undefined;
  fFile: File | undefined | null;
  r: string | undefined;
  rFile: File | undefined | null;
  t: string | undefined;
  tFile: File | undefined | null;
};

export const CreateModelPage: FC = () => {
  const [trigger, result, lastPromiseInfo] = useLazyCreateModelQuery();
  const [files, setFiles] = useState<TFiles>({
    f: "",
    fFile: null,
    r: "",
    rFile: null,
    t: "",
    tFile: null,
  });

  const [downloadableContent, setDownloadableContent] = useState<File | null>(
    null
  );

  const [model3D, setModel3D] = useState<string>("");

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "70%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {["f", "r", "t"].map((el) => {
          return (
            <Box
              display={"flex"}
              flexDirection={"column"}
              width="300px"
              height="300px"
              key={el}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {files[el as keyof TFiles] ? (
                <img
                  src={files[el as keyof TFiles] as string}
                  style={{ maxHeight: "200px", maxWidth: "200px" }}
                />
              ) : null}
              <Button variant="contained" component="label" key={el}>
                {files[el as keyof TFiles]
                  ? "Изменить эскиз проекции"
                  : "Загрузить эскиз проекции"}{" "}
                {el.toLocaleUpperCase()}
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    if (e.target?.files) {
                      setFiles({
                        ...files,
                        [el]: URL.createObjectURL(e.target.files[0]),
                        [el + "File"]: e.target.files[0],
                      });
                    }
                  }}
                  key={el}
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg"
                />
              </Button>
            </Box>
          );
        })}
      </Box>
      <Button
        sx={{
          width: "400px",
          height: "100px",
          fontSize: "2em",
        }}
        variant="contained"
        disabled={!(files.f && files.r && files.t)}
        onClick={() => {
          const bodyFormData = new FormData();
          if (files.fFile && files.rFile && files.tFile) {
            bodyFormData.append("f", files.fFile);
            bodyFormData.append("r", files.rFile);
            bodyFormData.append("t", files.tFile);
            trigger(bodyFormData);
          }
        }}
      >
        Создать 3D-модель
      </Button>
    </Box>
  );
};
