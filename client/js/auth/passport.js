import Service from "./service";
import { Session } from "rumsan-ui";

$(document).ready(async () => {
  localStorage.setItem("access_token", access_token);
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");

  let data = await Service.getData();
  Session.set(data);
  if (data.user.farmer_id) localStorage.setItem("farmerId", data.user.farmer_id);
  if (data.user.distributor_id) localStorage.setItem("distributorId", data.user.distributor_id);
  if (!data.access_token) window.location.replace("/login");
  if (redirect_url) window.location.replace(redirect_url);
  else window.location.replace("/cms");
});
