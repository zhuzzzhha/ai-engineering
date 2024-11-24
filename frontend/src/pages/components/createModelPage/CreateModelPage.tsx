import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useLazyCreateModelQuery } from "../../api";
import { StlViewer } from "react-stl-viewer";

type TFiles = {
  f: string | undefined;
  fFile: File | undefined | null;
  r: string | undefined;
  rFile: File | undefined | null;
  t: string | undefined;
  tFile: File | undefined | null;
};

export const CreateModelPage: FC = () => {
  const [trigger, result] = useLazyCreateModelQuery();
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

  useEffect(() => {
    if (result.data) {
      setDownloadableContent(result.data);
      setModel3D(URL.createObjectURL(result.data));
    }
  }, [result.data, result.isSuccess]);

  const handleDownloadButton = () => {
    if (!downloadableContent) return;
    const element = document.createElement("a");
    element.href = URL.createObjectURL(downloadableContent);

    element.setAttribute("download", `result.stl`);

    document.body.appendChild(element);
    element.click();
  };

  if (result.isLoading) {
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
      <CircularProgress />
    </Box>;
  }

  if (result.isError || !result.isSuccess) {
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
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: "2em",
        }}
      >
        Произошла ошибка :(
      </Typography>

      <Button
        onClick={() => {
          setModel3D("");
          setDownloadableContent(null);
          setFiles({
            f: "",
            fFile: null,
            r: "",
            rFile: null,
            t: "",
            tFile: null,
          });
        }}
        sx={{
          fontSize: "1em",
        }}
        variant="contained"
      >
        Попробовать ещё раз
      </Button>
    </Box>;
  }
  if (result.isSuccess && model3D && downloadableContent) {
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
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "1.5em",
          }}
        >
          Результат работы модели
        </Typography>
        <Box
          sx={{
            border: "2px black solid",
            margin: "5px",
          }}
        >
          <StlViewer
            style={{
              height: "75vh",
              width: "80vw",
            }}
            orbitControls
            shadows
            url={model3D}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            sx={{
              fontSize: "1em",
            }}
            variant="contained"
            onClick={() => handleDownloadButton()}
          >
            Скачать данную модель в формате STL
          </Button>
          <Button
            onClick={() => {
              setModel3D("");
              setDownloadableContent(null);
              setFiles({
                f: "",
                fFile: null,
                r: "",
                rFile: null,
                t: "",
                tFile: null,
              });
            }}
            sx={{
              fontSize: "1em",
            }}
            variant="contained"
          >
            Создать новую модель
          </Button>
        </Box>
      </Box>
    );
  }
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
        onClick={async () => {
          const bodyFormData = new FormData();
          if (files.fFile && files.rFile && files.tFile) {
            bodyFormData.append("front", files.fFile);
            bodyFormData.append("side", files.rFile);
            bodyFormData.append("top", files.tFile);
            trigger(bodyFormData);
          }
        }}
      >
        Создать 3D-модель
      </Button>
    </Box>
  );
};
