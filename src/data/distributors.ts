import { Distributor } from "@/types";

export interface RegisteredDistributor extends Distributor {
  passcode: string;
  avatarInitials: string;
}

export const INITIAL_DISTRIBUTORS: RegisteredDistributor[] = [
  {
    id: "DST-LAG-01",
    name: "Adekunle Logistics Services",
    contactPerson: "Adekunle Balogun",
    phone: "+234 803 123 4567",
    email: "adekunle@paxlogistics.ng",
    coverageArea: "Lagos Island, Ikoyi, Victoria Island & Lekki-Epe Axis",
    vehicleType: "Express Courier",
    status: "Active",
    activeOrdersCount: 3,
    completedDeliveries: 428,
    joinedDate: "Jan 12, 2026",
    passcode: "1234",
    avatarInitials: "AB",
  },
  {
    id: "DST-MAIN-02",
    name: "Ikeja Swift Haulage Ltd",
    contactPerson: "Emeka Okonkwo",
    phone: "+234 802 987 6543",
    email: "emeka@paxlogistics.ng",
    coverageArea: "Lagos Mainland, Ikeja Industrial, Maryland & Surulere",
    vehicleType: "Van",
    status: "Active",
    activeOrdersCount: 2,
    completedDeliveries: 315,
    joinedDate: "Feb 04, 2026",
    passcode: "2345",
    avatarInitials: "EO",
  },
  {
    id: "DST-ABJ-03",
    name: "Capital Rapid Dispatch Network",
    contactPerson: "Fatima Danjuma",
    phone: "+234 809 555 7890",
    email: "fatima@paxlogistics.ng",
    coverageArea: "Abuja FCT, Garki, Wuse II, Maitama & Airport Road",
    vehicleType: "Fleet",
    status: "Active",
    activeOrdersCount: 2,
    completedDeliveries: 192,
    joinedDate: "Mar 18, 2026",
    passcode: "3456",
    avatarInitials: "FD",
  },
];
