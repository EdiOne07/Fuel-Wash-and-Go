// navigation/RootStackParamList.ts
export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    Dashboard: undefined;
    Home:undefined;
    StationDetails: {
      stationId: string;
      stationType: "gas" | "washing";
    };
    Profile:undefined;
    RouteScreen:undefined;
  };
  