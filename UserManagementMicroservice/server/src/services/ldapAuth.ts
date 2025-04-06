import ldap, {
  SearchCallbackResponse,
  SearchOptions,
  SearchEntry,
  SearchEntryObject,
} from "ldapjs";
import dotenv from "dotenv";

dotenv.config();

const LDAP_URL = process.env.LDAP_URL || "ldap://localhost:389";
const BIND_DN = process.env.LDAP_BIND_DN || "";
const BIND_PASSWORD = process.env.LDAP_BIND_PASSWORD || "";
const BASE_DN = process.env.LDAP_BASE_DN || "";

export const authenticateUser = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({ url: LDAP_URL });

    // Bind as admin to search for the user
    client.bind(BIND_DN, BIND_PASSWORD, (err) => {
      if (err) {
        return reject(new Error("Admin Bind Failed"));
      }

      // Search for user by email
      const opts: SearchOptions = {
        filter: `(mail=${email})`,
        scope: "sub",
        attributes: ["dn", "employeeNumber", "cn", "mail", "gidNumber"],
      };

      client.search(
        BASE_DN,
        opts,
        (err: Error | null, res: SearchCallbackResponse) => {
          if (err) {
            client.unbind();
            return reject(new Error("LDAP Search Error"));
          }
          let userDn : string ;
          let employeeNumber: string | null = null;
          let employeeName: string | null = null;
          let employeeEmail: string | null = null;
          let employeeCenter: string | null = null;
          let gidNumber: string | null = null;

          res.on("searchEntry", (entry: SearchEntry) => {
            const user = entry;
            // userDn = entry.toObject();
            // console.log(userDn)
            employeeNumber =
              user.attributes.find((attr) => attr.type === "employeeNumber")
                ?.values[0] || null;
            console.log(employeeNumber);
            employeeName =
              user.attributes.find((attr) => attr.type === "cn")?.values[0] ||
              null;
            console.log(employeeName);
            employeeEmail =
              user.attributes.find((attr) => attr.type === "mail")?.values[0] ||
              null;
            console.log(employeeEmail);
            gidNumber =
              user.attributes.find((attr) => attr.type === "gidNumber")
                ?.values[0] || null;
            console.log(gidNumber);
          });

          res.on("end", async () => {
            if (!employeeEmail) {
              client.unbind();
              return reject(new Error("User not found"));
            }

            // Bind as user to verify password
            // client.bind(userDn, password, async (err:Error | null) => {
            //   if (err) {
            //     client.unbind();
            //     return reject(new Error("Invalid Credentials"));
            //   }

              // Fetch employee center name from gidNumber
              if (gidNumber) {
                employeeCenter = await getCenterName(client, gidNumber);
                console.log(employeeCenter);
              }

              client.unbind();
              resolve({
      
                employeeNumber,
                employeeName,
                employeeEmail,
                employeeCenter,
              });
            });
          });
        }
      );
    });
  };

const getCenterName = (
  client: ldap.Client,
  gidNumber: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const opts: SearchOptions = {
      filter: `(gidNumber=${gidNumber})`,
      scope: "sub",
      attributes: ["cn"],
    };

    client.search(
      `ou=Centers,${BASE_DN}`,
      opts,
      (err: Error | null, res: SearchCallbackResponse) => {
        if (err) {
          return reject(new Error("LDAP Center Search Error"));
        }

        let centerName: string | null = null;

        res.on("searchEntry", (entry) => {
            const user = entry;
          centerName=
            user.attributes.find((attr) => attr.type === "cn")
              ?.values[0] || null;
              console.log(centerName);
        });

        res.on("end", () => {
          resolve(centerName);
        });
      }
    );
  });
};
