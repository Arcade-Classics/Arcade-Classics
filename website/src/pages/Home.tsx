import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Home: () => JSX.Element = (): JSX.Element => {
  return (
    <>
      <div>
        <h1 className="text-center text-7xl pt-36">Arcade Classics</h1>
        <h1 className="text-center text-4xl">9 classic Arcade Games</h1>
      </div>
      <div className="mt-12 flex justify-center">
        <Stack direction="row" spacing={2}>
          <Button className="m-2 text-black" size="large" variant="contained" href="https://chrome.google.com/webstore/detail/arcade-classics/gokcmhknbfbkchaljcbjloaebnoblcnd" color="primary">
            Download
          </Button>
        </Stack>
      </div>
    </>
  );
};

export default Home;
