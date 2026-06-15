/**
 * Weekly on-air schedule, used by the "On Air Now" homepage section.
 *
 * Each show is a recurring weekly window defined by a local start/end time
 * (24h, America/Los_Angeles) and the weekdays it airs. The original source
 * had one-off calendar + expiry dates; those are intentionally omitted — this
 * models the perpetual weekly grid. Edit a row here to change the lineup.
 *
 * Day codes: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat.
 */

export const SCHEDULE_TZ = "America/Los_Angeles";

export type ScheduleStation = {
  key: string;
  name: string;
  frequency: string | null;
  logo?: string;
  href: string;
};

export type Show = {
  station: string; // ScheduleStation.key
  title: string;
  start: string; // "HH:MM" (24h, SCHEDULE_TZ)
  end: string; // "HH:MM" (24h); end <= start means it runs past midnight
  days: number[]; // weekday codes the show STARTS on
};

// Day-set shorthands
const ALL = [0, 1, 2, 3, 4, 5, 6];
const SUN_FRI = [0, 1, 2, 3, 4, 5];
const MON_FRI = [1, 2, 3, 4, 5];
const MON_SAT = [1, 2, 3, 4, 5, 6];
const MWF = [1, 3, 5];
const SAT = [6];
const SUN = [0];

export const scheduleStations: ScheduleStation[] = [
  {
    key: "mix967",
    name: "Mix 96.7",
    frequency: "96.7",
    logo: "/images/mix-96-7.png",
    href: "https://www.mix967fm.com",
  },
  {
    key: "bigcountry",
    name: "Big Country",
    frequency: "103.9",
    logo: "/images/big-country.png",
    href: "https://www.big1039fm.com",
  },
  {
    key: "kool",
    name: "94.5 Kool FM",
    frequency: "94.5",
    logo: "/images/kool-94-5.png",
    href: "https://www.kool945fm.com",
  },
  {
    key: "coyote",
    name: "Coyote Rock",
    frequency: "101.1",
    logo: "/images/coyote-rock.png",
    href: "https://www.rock1011fm.com",
  },
  {
    key: "talk",
    name: "Talk Radio 107.7",
    frequency: "107.7",
    logo: "/images/talk-radio.png",
    href: "https://www.talk1077fm.com",
  },
  {
    key: "mix1075",
    name: "Mix 107.5",
    frequency: "107.5",
    logo: "/images/mix-107-5.png",
    href: "https://www.heymix.com",
  },
  {
    key: "ksel",
    name: "KSEL Country",
    frequency: "105.9",
    logo: "/images/ksel-country.png",
    href: "http://kselcountry.com",
  },
  {
    key: "truecountry",
    name: "True Country",
    frequency: null,
    logo: "/images/cow-country.png",
    href: "https://www.cowcountryradio.com/",
  },
];

export const shows: Show[] = [
  // ---- Mix 96.7 ----
  { station: "mix967", title: "Sandy Beeler", start: "05:00", end: "12:00", days: MON_FRI },
  { station: "mix967", title: "Jen Austin", start: "14:00", end: "18:00", days: MON_FRI },
  { station: "mix967", title: "The Ray Ray Show", start: "18:00", end: "22:00", days: MON_FRI },
  { station: "mix967", title: "Cody Boyer", start: "22:00", end: "02:00", days: MON_FRI },

  // ---- Big Country 103.9 ----
  { station: "bigcountry", title: "The Sandy Show", start: "06:00", end: "10:00", days: MON_SAT },
  { station: "bigcountry", title: "Katy & Carri", start: "06:00", end: "10:00", days: MON_FRI },
  { station: "bigcountry", title: "Sandy Beeler", start: "10:00", end: "15:00", days: MON_FRI },
  { station: "bigcountry", title: "Sean Matthews", start: "10:00", end: "14:00", days: SUN_FRI },
  { station: "bigcountry", title: "Kelly G", start: "10:00", end: "14:00", days: SAT },
  { station: "bigcountry", title: "The Car Doctor", start: "11:00", end: "13:00", days: SAT },
  { station: "bigcountry", title: "Todd Edwards", start: "14:00", end: "19:00", days: MON_SAT },
  { station: "bigcountry", title: "Seth Daniel", start: "15:00", end: "18:00", days: MON_FRI },
  { station: "bigcountry", title: "Nights with Elaina", start: "19:00", end: "00:00", days: ALL },

  // ---- 94.5 Kool FM ----
  { station: "kool", title: "Ashley & Brad In The Morning", start: "06:00", end: "10:00", days: MON_SAT },
  { station: "kool", title: "Katie Clark", start: "10:00", end: "14:00", days: MON_FRI },
  { station: "kool", title: "Casey Kasem", start: "10:00", end: "14:00", days: SAT },
  { station: "kool", title: "Bryan Simmons", start: "14:00", end: "18:00", days: MON_SAT },
  { station: "kool", title: "Dave Malone", start: "15:00", end: "18:00", days: SUN },
  { station: "kool", title: "Rick Dees", start: "18:00", end: "22:00", days: MON_FRI },

  // ---- Coyote Rock 101.1 ----
  { station: "coyote", title: "Carl Russo", start: "01:00", end: "06:00", days: MON_SAT },
  { station: "coyote", title: "Marty", start: "01:00", end: "06:00", days: SUN },
  { station: "coyote", title: "Marty & Shannon", start: "06:00", end: "10:00", days: MON_FRI },
  { station: "coyote", title: "Tooch", start: "06:00", end: "10:00", days: SAT },
  { station: "coyote", title: "McKenzie Rae", start: "10:00", end: "15:00", days: MON_FRI },
  { station: "coyote", title: "Peter Z", start: "10:00", end: "15:00", days: SAT },
  { station: "coyote", title: "Bryan Jester", start: "15:00", end: "20:00", days: MON_FRI },
  { station: "coyote", title: "Jack Kelly", start: "15:00", end: "20:00", days: SAT },
  { station: "coyote", title: "Mark Stevens", start: "15:00", end: "20:00", days: SUN },
  { station: "coyote", title: "Joey Neal", start: "20:00", end: "01:00", days: SUN_FRI },
  { station: "coyote", title: "Haley Quinn", start: "20:00", end: "01:00", days: SAT },

  // ---- Talk Radio 107.7 ----
  { station: "talk", title: "Mike Gallagher", start: "06:00", end: "09:00", days: MON_FRI },
  { station: "talk", title: "The Dan Bongino Show", start: "09:00", end: "12:00", days: MON_FRI },
  { station: "talk", title: "The Car Doctor", start: "11:00", end: "13:00", days: SAT },
  { station: "talk", title: "Kate Dalley", start: "12:00", end: "14:00", days: MON_FRI },
  { station: "talk", title: "Community Conversation", start: "14:00", end: "15:00", days: MWF },
  { station: "talk", title: "The Joe Pags Show", start: "15:00", end: "18:00", days: MON_FRI },
  { station: "talk", title: "Dave Ramsey", start: "18:00", end: "21:00", days: MON_FRI },
  { station: "talk", title: "Coast to Coast with George Noory", start: "22:00", end: "02:00", days: MON_FRI },

  // ---- Mix 107.5 (Heymix) ----
  { station: "mix1075", title: "Seth & Terri", start: "06:00", end: "10:00", days: MON_FRI },
  { station: "mix1075", title: "Billy Michaels", start: "10:00", end: "14:00", days: MON_FRI },
  { station: "mix1075", title: "Jen Austin", start: "14:00", end: "18:00", days: MON_FRI },

  // ---- KSEL Country 105.9 ----
  { station: "ksel", title: "The Throwdown", start: "06:00", end: "10:00", days: MON_FRI },
  { station: "ksel", title: "Todd Edwards", start: "10:00", end: "15:00", days: MON_FRI },
  { station: "ksel", title: "Afternoons with Lisa Schmidt", start: "15:00", end: "19:00", days: MON_FRI },

  // ---- True Country ----
  { station: "truecountry", title: "Rick Morgan", start: "03:00", end: "07:00", days: MON_FRI },
  { station: "truecountry", title: "Ashley Blake", start: "07:00", end: "12:00", days: MON_FRI },
  { station: "truecountry", title: "Mark Stevens", start: "12:00", end: "17:00", days: MON_FRI },
  { station: "truecountry", title: "Dave Sanders", start: "17:00", end: "22:00", days: MON_FRI },
  { station: "truecountry", title: "Kevin Freeman", start: "22:00", end: "03:00", days: MON_FRI },
];
