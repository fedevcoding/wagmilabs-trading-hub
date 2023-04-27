const { connectDB } = require("../../config/db");
const Drops = require("../../models/calendars/DropsModel");
require("dotenv").config();
const fetch = require("node-fetch");

(async () => {
  try {
    await connectDB();

    // Salvare i dati dei 6 mesi
    for (let i = -1; i <= 5; i++) {
      const currentMonth = new Date().getMonth() + i;
      const startOfMonth = new Date(new Date().getFullYear(), currentMonth, 1).getTime();
      const endOfMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getTime();

      let result = await fetch(
        `https://www.alphabot.app/api/projectData?calendar=true&startDate=${startOfMonth}&endDate=${endOfMonth}&selectedMonth=${
          currentMonth + 1
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await result.json();

      const mappedData = data.projects.map(project => {
        const obj = {
          timestamp: project.mintDate,
          collectionName: project.name,
          links: {},
          eventDescription: "",
        };

        if (project?.pubPrice !== undefined) {
          const value = parseFloat(project.pubPrice);
          if (!isNaN(value)) {
            obj.price = value;
          }
        }
        if (project?.supply !== undefined) {
          const value = parseFloat(project.supply);
          if (!isNaN(value)) {
            obj.supply = value;
          }
        }
        if (project?.discordUrl !== undefined) {
          obj.links.discord = project.discordUrl;
        }
        if (project?.twitterUrl !== undefined) {
          obj.links.twitter = project.twitterUrl;
        }
        return obj;
      });

      await Drops.deleteMany({ timestamp: { $gte: startOfMonth, $lte: endOfMonth } });
      const savedData = await Drops.create(mappedData);
      console.log(`Saved ${savedData.length} records for month ${currentMonth + 1} to the database.`);
    }

    console.log("All data saved successfully.");
  } catch (error) {
    console.error("Error saving data to database:", error);
  }
})();
