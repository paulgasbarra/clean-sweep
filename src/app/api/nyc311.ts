
const NYC_311_API = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json';

interface NYC311Report {
  unique_key: string;
  created_date: string;
  descriptor: string;
  incident_address: string;
  latitude: string;
  longitude: string;
  status: string;
}

export async function fetchRecentLitterReports() {
  console.log('Fetching recent litter reports from NYC 311...');
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 28);
  
  const dateString = twoWeeksAgo.toISOString().split('T')[0];
  
  const url = `${NYC_311_API}?` + new URLSearchParams({
    // query the Department of Sanitation for litter reports
    agency: 'DSNY',
    // only get reports created in the last two weeks
    $where: `created_date > '${dateString}'`,
    // only get reports with a status of "open"
    complaint_type: 'Dirty Condition',
    // exclude reports that are already closed
    status: "In Progress",
    // limit the number of results to 50
    $limit: '15',
  });

  try {
    const response = await fetch(url);
    const data: NYC311Report[] = await response.json();
    const reports = data.map(report => ({
      id: report.unique_key,
      description: report.descriptor,
      status: report.status,
      location: {
        lat: parseFloat(report.latitude),
        long: parseFloat(report.longitude)
      },
      address: report.incident_address,
      created_at: new Date(report.created_date),
      reported_by: 'nyc311',
      image_urls: {
        before: [],
        during: [],
        after: []
      }
    }));
    return reports;
    // //** 
    // // Store in Firestore
    // const sitesRef = collection(db, 'Sites');
    // // Check for existing reports
    // const existingReports = await getDocs(
    //   query(sitesRef, where('source_id', 'in', reports.map(r => r.source_id)))
    // );
    // const existingIds = new Set(existingReports.docs.map(doc => doc.data().source_id));
    // console.log("existingIds:", existingIds);
    // // Add only new reports
    // const newReports = reports.filter(report => !existingIds.has(report.source_id));
    
    // for (const report of newReports) {
    //   await addDoc(sitesRef, report);
    // }


    // return newReports;
  
  } catch (error) {
    console.error('Error fetching NYC 311 data:', error);
    throw error;
  }
}
