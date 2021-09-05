import { AccordionSummary, Accordion, AccordionDetails, Box, Button, Icon, makeStyles, Typography } from "@material-ui/core";
import { Fragment } from "react";
import { useRef, useState } from "react";
import { bannerSizes } from "../../../constants/common";
import { uploadBannersApi } from "../../../services/apiService";
import Loading from "../../UI/Loading";
import Modal from "../../UI/Modal";

const useStyles = makeStyles((theme) => ({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  container: {
    margin: "20px auto",
  },
  uploadBtnContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtn: {
    padding: "40px 20px",
  },
  uploadBtnLabel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: theme.palette.primary.main,
  },
  success: {
    color: theme.palette.success.main,
  },
  err: {
      color: theme.palette.error.main
  },
  big: {
      fontSize: '2.5em'
  }
}));

const UploadBannersModal = (props) => {
  const muiStyles = useStyles();
  const fileRef = useRef();
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [err, setErr] = useState(null);

  const uploadFiles = async () => {
    if(validateFiles()) {
        const images = fileRef.current.files;
        
        const formData = new FormData();

        for(let i = 0;i < images.length;i++) {
            formData.append("banners", images[i]);
        }

        try {
            setLoading(true);
            await uploadBannersApi(formData);
            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setSuccess(null);
            setFilesList([]);
            console.log(err);
        }
    }
  }

  const updateFilesList = () => {
    const input = fileRef.current;
    const fileArr = [];
    for (let i = 0; i < input.files.length; i++) {
      fileArr.push(input.files.item(i).name);
    }
    validateFiles();
    setFilesList(fileArr);
  };

  const validateFiles = () => {
    const input = fileRef.current;
    
    // Max files limit
    if(input.files.length > 5) {
        setErr('Max Files Upload Limit is 5');
        return false;
    }
    if(input.files.length < 1) {
        setErr('Choose atleast 1 banner');
        return false;
    }
    // Max file size
    for (let i = 0; i < input.files.length; i++) {
        if(input.files[i].size > 10000000) {
            setErr('Max file size per upload is 10MB');
            return false;
        }
    }
    // Validate image dimensions
    const _URL = window.URL || window.webkitURL;
    let file, img;
    for (let i = 0; i < input.files.length; i++) {
        if ((file = input.files[i])) {
            img = new Image();
            var objectUrl = _URL.createObjectURL(file);
            img.onload = function () {
                const dimensions = `${this.width}x${this.height}`;
                if(!bannerSizes.includes(dimensions)) {
                    setErr('One or more banners have invalid dimensions, please choose banners with correct dimensions!');
                    return false;
                }
            };
            img.src = objectUrl;
        }
    
    }
    
    setErr(null);
    return true;
  }

  return (
    <Modal
      title="Upload Banners"
      maxWidth="lg"
      onClose={props.onClose}
      maxWidth="md"
    >
      {!loading && !success && (
        <Fragment>
          <Box component="div" className={muiStyles.container}>
            <Box component="div" className={muiStyles.uploadBtnContainer}>
              <Button
                color="primary"
                variant="outlined"
                component="label"
                className={muiStyles.uploadBtn}
              >
                <Box component="div" className={muiStyles.uploadBtnLabel}>
                  <Icon>upload</Icon>
                  Upload Files
                </Box>
                <input
                  type="file"
                  name="banners"
                  ref={fileRef}
                  onChange={updateFilesList}
                  multiple="multiple"
                  accept="image/png, image/jpeg, image/jpg"
                  hidden
                />
              </Button>
            </Box>
            {err && <Box component="div" className={`${muiStyles.err} mt-10 text-center`}>{err}</Box>}
            <Box className="mt-10">
              {filesList.map((file, idx) => (
                <Box
                  component="div"
                  className={`text-center ${muiStyles.link}`}
                  key={idx}
                >
                  {file}
                </Box>
              ))}
            </Box>
            <Box className="mt-10">
              <Accordion>
                <AccordionSummary
                  expandIcon={<Icon>expand_more</Icon>}
                >
                  <Typography variant="subtitle2" className={muiStyles.link}>
                    View Acceptable Banner Sizes
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {bannerSizes.map((size, idx) => (
                    <Box variant="div" key={idx} className={`${muiStyles.link} ml-10`}>
                        {size}
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
          <Box component="div">
            <Button color="primary" variant="contained" onClick={uploadFiles} className={"fright"}>
              Upload
            </Button>
          </Box>
        </Fragment>
      )}
      {loading && <Loading msg="Uploading..." />}
      {!loading && success && (
        <Box component="div" className={muiStyles.successContainer}>
            <Typography>
                <Icon className={`${muiStyles.success} ${muiStyles.big}`}>
                    cloud_done
                </Icon>
            </Typography>
            <Typography variant="subtitle2" className={muiStyles.success}>
                Upload Successfull, hit refresh on banners list to see uploaded banners.
            </Typography>
            <Typography variant="subtitle2" className={muiStyles.link}>
                Please note that, it may take few seconds for banners to appear, 
                try refreshing after some time if it doesn't.
            </Typography>
            <Button 
                color="primary" 
                className="mt-10" 
                variant="outlined"
                onClick={() => {
                    setSuccess(null);
                }}
            >
                Upload More
            </Button>
        </Box>
      )}
    </Modal>
  );
};

export default UploadBannersModal;
