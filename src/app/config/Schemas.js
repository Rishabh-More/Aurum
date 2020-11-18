const ShopSchema = {
  name: "Shop",
  primaryKey: "id",
  properties: {
    id: "int",
    shopName: "string?",
    email: "string?",
    phone: "string?",
    allowedDevices: "int?",
    features: "string?",
    company: "Company",
    address: "Address",
    taxId: "int?",
    createdAt: "string?",
    updatedAt: "string?",
    deletedAt: "string?",
    licenseKey: "string?",
    licenseRegAt: "string?",
    licenseExpiresAt: "string?",
    otp: "string?",
    otpCreatedAt: "string?",
    otpExpireAt: "string?",
    shopLogoUrl: "string?",
  },
};

const CompanySchema = {
  name: "Company",
  primaryKey: "id",
  properties: {
    id: "int",
    email: "string?",
    companyName: "string?",
    companyLogoUrl: "string?",
    phone: "string?",
    maxLicense: "int?",
    addressId: "int?",
    taxId: "int?",
    createdAt: "string?",
    updatedAt: "string?",
    deletedAt: "string?",
  },
};

const AddressSchema = {
  name: "Address",
  primaryKey: "id",
  properties: {
    id: "int",
    isPrimary: "int?",
    label: "string?",
    phone: "string?",
    addressLine1: "string?",
    addressLine2: "string?",
    city: "string?",
    state: "string?",
    country: "string?",
    pincode: "string?",
    locationLat: "string?",
    locationLong: "string?",
    createdAt: "string?",
    updatedAt: "string?",
    deletedAt: "string?",
  },
};

export { ShopSchema, CompanySchema, AddressSchema };
