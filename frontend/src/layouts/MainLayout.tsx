import React from "react";
import Container from "@mui/material/Container";
// import Header from "@/components/Header";

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <Container sx={{ py: 3 }} maxWidth="lg">
        {children}
      </Container>
    </>
  );
};

export default MainLayout;
