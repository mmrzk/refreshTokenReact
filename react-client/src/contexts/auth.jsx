import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
} from "react";
import { loginAPI, logoutAPI, refreshTokenAPI } from "../api";

export const AuthContext = createContext(null);

const styleVariants = {
  regular: "white",
  pause: "orange",
  resume: "yellow",
  success: "lime",
  error: "tomato",
};

const createStyles = (bgColor) =>
  Object.entries(styleVariants).reduce(
    (acc, [variant, color]) => ({
      ...acc,
      [variant]: `background-color: ${bgColor}; font-size: 1.5em; font-weight: bold; color: ${color};`,
    }),
    {}
  );

const requestStyles = createStyles("rgb(0,0,139, 0.7)");
const initTokenStyles = createStyles("rgb(128,0,128, 0.7)");
const responseStyles = createStyles("rgb(0,0,0, 0.5)");

let awaitRefreshTokenPromise;

export default function AuthProvider({ children, axiosClient }) {
  const accessToken = useRef();
  const [lastToken, setLastToken] = useState(accessToken.current);
  const [interceptorsAdded, setInterceptorsAdded] = useState();
  const [authState, setAuthState] = useState(undefined);

  useEffect(() => {
    async function tryRefreshToken() {
      try {
        console.log(
          `%c[ініціялізація токена] намагаємося отримати токен вперше`,
          initTokenStyles.regular
        );
        const refreshResponse = await refreshTokenAPI();
        const newAccessToken = refreshResponse.data.accessToken;
        accessToken.current = newAccessToken;
        setLastToken(newAccessToken);
        setAuthState(true);
        console.log(
          `%c[ініціялізація токена] отримали та встановили токен вперше`,
          initTokenStyles.success
        );
      } catch {
        console.log(
          `%c[ініціялізація токена] не змогли отримати токен вперше`,
          initTokenStyles.error
        );
        accessToken.current = undefined;
        setAuthState(false);
      }
    }

    if (interceptorsAdded && !accessToken.current && authState === undefined) {
      tryRefreshToken();
    }
  }, [authState, interceptorsAdded]);

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config) => {
        const randomId = config.randomId ?? Math.round(Math.random() * 1000);
        config.randomId = randomId;
        console.log(
          `%c[${randomId} ${config.method} ${
            config.url
          }] спроба відправити запит з токеном: ${accessToken?.current?.slice(
            -3
          )}`,
          requestStyles.regular
        );
        if (awaitRefreshTokenPromise) {
          console.log(
            `%c[${randomId} ${config.method} ${config.url}] очікуємо на новий токен...`,
            requestStyles.pause
          );
          await awaitRefreshTokenPromise.catch(console.log);
          console.log(
            `%c[${randomId} ${config.method} ${config.url}] отримали новий токен!`,
            requestStyles.resume
          );
        }
        if (
          config?.headers?.set &&
          config.headers.set instanceof Function &&
          accessToken.current
        ) {
          console.log(
            `%c[${randomId} ${config.method} ${
              config.url
            }] відправляємо запит з новим токеном: ${accessToken?.current?.slice(
              -3
            )}`,
            requestStyles.success
          );
          config.headers["Authorization"] = `Bearer ${accessToken.current}`;
          return config;
        }
        console.log(
          `[${randomId} ${config.method} ${
            config.url
          }] не змогли відправити запит з токеном: ${accessToken?.current?.slice(
            -3
          )}`,
          requestStyles.error
        );
      }
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async function ({ response }) {
        const config = response?.config;
        console.log(
          `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] отримали відповідь...`,
          responseStyles.regular
        );

        if (response?.status === 401 && !config?.sent) {
          config.sent = true;
          if (!awaitRefreshTokenPromise) {
            console.log(
              `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] створюємо проміс для очікування на новий токен`,
              responseStyles.regular
            );
            awaitRefreshTokenPromise = new Promise((resolve, reject) => {
              const refreshFunction = async () => {
                try {
                  const refreshResponse = await refreshTokenAPI();
                  const newAccessToken = refreshResponse.data.accessToken;
                  accessToken.current = newAccessToken;
                  setLastToken(newAccessToken);
                  resolve(true);
                } catch (err) {
                  reject(err);
                }
              };
              return refreshFunction();
            });
          } else {
            console.log(
              `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] проміс уже створений`,
              responseStyles.regular
            );
          }
          try {
            console.log(
              `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] очікуємо на новий токен...`,
              responseStyles.pause
            );
            await awaitRefreshTokenPromise;
            console.log(
              `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] отримали новий токен!`,
              responseStyles.resume
            );
            awaitRefreshTokenPromise = null;
            setAuthState(true);

            if (config?.headers?.set && config.headers.set instanceof Function)
              config.headers.set(
                "Authorization",
                `Bearer ${accessToken.current}`
              );

            config.randomId = config.randomId + " (ПОВТОР)";
            return axiosClient(config);
          } catch (err) {
            console.log(
              `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] під час ґенерації нового токена сталася помилка`,
              responseStyles.error
            );
            accessToken.current = undefined;
            setAuthState(false);
            throw err;
          } finally {
            console.log(
              `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] очищуємо проміс`,
              responseStyles.regular
            );
            awaitRefreshTokenPromise = null;
          }
        } else if (response?.status === 401) {
          console.error(
            `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] сталася повторна помилка, після ґенерації нового токена`,
            responseStyles.error
          );
          accessToken.current = undefined;
          setAuthState(false);
          throw response;
        } else {
          console.log(
            `%c[${config.randomId} ${config.method} ${config.url} ${response.status}] сталася невідома помилка`,
            responseStyles.error
          );
        }
        throw response;
      }
    );

    setInterceptorsAdded(true);
    console.log(`added interceptors`);
    return () => {
      setInterceptorsAdded(false);
      console.log(`removed interceptors`);
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosClient]);

  const signIn = useCallback(async (loginPayload) => {
    try {
      const loginResult = await loginAPI(loginPayload);
      accessToken.current = loginResult.data.accessToken;
      setLastToken(accessToken.current);
      setAuthState(true);
    } catch (err) {
      console.log({ err });
      accessToken.current = undefined;
      setAuthState(false);
      onError?.(err);
    }
  }, []);

  const signOut = useCallback(async () => {
    await logoutAPI();
    accessToken.current = undefined;
    setAuthState(false);
  }, []);

  const value = useMemo(() => {
    return {
      signIn,
      signOut,
      interceptorsAdded: Boolean(interceptorsAdded),
      authState,
      lastToken,
    };
  }, [interceptorsAdded, authState, signIn, signOut, lastToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
