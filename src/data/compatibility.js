export const bloodTypeInfo = {
  "A+": { donors: ["A+", "A-", "O+", "O-"], recipients: ["A+", "AB+"] },
  "A-": { donors: ["A-", "O-"], recipients: ["A+", "A-", "AB+", "AB-"] },
  "B+": { donors: ["B+", "B-", "O+", "O-"], recipients: ["B+", "AB+"] },
  "B-": { donors: ["B-", "O-"], recipients: ["B+", "B-", "AB+", "AB-"] },
  "AB+": { donors: ["AB+", "A+", "B+", "O+", "A-", "B-", "O-", "AB-"], recipients: ["AB+"] },
  "AB-": { donors: ["AB-", "A-", "B-", "O-"], recipients: ["AB+", "AB-"] },
  "O+": { donors: ["O+", "O-"], recipients: ["A+", "B+", "AB+", "O+"] },
  "O-": { donors: ["O-"], recipients: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"] },
};

export const isCompatible = (donor, recipient) => {
  return bloodTypeInfo[donor].recipients.includes(recipient);
}