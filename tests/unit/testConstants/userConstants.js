// Declaration Conventions:
//     - All declarations should use const.
//     - Create Objects for constants with similar categories with plural name. e.g. "export const EMAILS = {};"
//     - Use ES6 format e.g. "export const {name} = {value};" for singular constants.
//     - Names should be uppercase with underscore separators e.g. "VAR_NAME".

export const EMAILS = {
    VALID_EMAIL: "email@address.com",
    VALID_EMAIL_NOTRIM: " email@address.com ",
    VALID_EMAIL_ALT: "emailalt@address.com",
    INVALID_EMAIL_NO_DOMAIN: "email@",
    INVALID_EMAIL_NO_TOP_DOMAIN: "email@address",
    INVALID_EMAIL_NO_AT: "emailaddress.com"
};

export const PASSWORDS = {
    VALID_PASSWORD: "pass word!$£",
    VALID_PASSWORD_NOTRIM: "  pass word!$£  "
};

export const USERNAMES = {
    VALID_USERNAME_ALPHA: "username",
    VALID_USERNAME_NUM: "12345",
    VALID_USERNAME_ALPHANUM: "username 12345",
    VALID_USERNAME_ALPHANUM_NOTRIM: " username 12345 ",
    INVALID_USERNAME_HAS_SPECIAL: "!username 12345£",
    INVALID_USERNAME_TOO_SHORT: "nam",
    INVALID_USERNAME_TOO_LONG: "username0123456789012345678901234567890123456789012" //51
};

export const HANDLES = {
    VALID_HANDLE: "handle123",
    VALID_HANDLE_ALT: "handle789",
    VALID_HANDLE_NOTRIM: " handle123 ",
    VALID_HANDLE_NON_ENGLISH: {
        ARABIC: "عاليعالية",
        CHINESE: "阿爱蔼愛藹",
        GERMAN: "äöüÄÖÜß",
    },
    INVALID_HANDLE_INNER_WHITESPACE: "han dle123",
    INVALID_HANDLE_INNER_WHITESPACE_NOTRIM: " han dle123 ",
    INVALID_HANDLE_TOO_SHORT: "han",
    INVALID_HANDLE_TOO_LONG: "handle1234567890",
};

export const VALID_BIO_NOTRIM = " This is a valid bio !234%&*^)( ";

export const LOCATIONS = {
    VALID_LOCATION_CITY_NOTRIM: " city ",
    VALID_LOCATION_CITY_COUNTRY_NOTRIM: " city, country ",
    INVALID_LOCATION_HAS_SPECIAL: " $city, country$ *&("
};

export const WEBSITES = {
    VALID_WEBSITE: "website.com",
    INVALID_WEBSITE_NO_SUBDOMAIN: ".com",
    INVALID_WEBSITE_NO_TOPDOMAIN: "website"
};

export const VALID_AVATAR = "avatar";
