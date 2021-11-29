import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { authActions } from "../../store/reducers/auth.reducer";

const RegisterWrapper = (props) => {
  const gToken = useSelector((state) => state.auth.gToken);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.setRequireRegister(false));
  }, [dispatch]);

  useEffect(() => {
    if(!gToken && router.pathname === '/register/google') router.push('/register');
    if(gToken && router.pathname === '/register') router.push('/register/google');
  }, [gToken]);

  return (
    <Fragment>
      <Head>
        <title>Join The Best Ad Network for Publishers & Advertisers - Adtol</title>
        <meta
          name="description"
          content="Join The Best Ad Network for Publishers to Monetize Websites & Blogs and Advertisers to Advertise Products, Grow Business & Make Profit. Join Adtol Now!"
        />
      </Head>
      {props.children}
    </Fragment>
  );
};

export default RegisterWrapper;
