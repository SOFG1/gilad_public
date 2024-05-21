import { createEvent } from "ics";
import type { EventAttributes } from "ics"



const downloadCalendarEvent = async (start_date: string, title: string, description: string, location?: string) => {

    const day = Number(start_date.slice(0, 2))
    const month = Number(start_date.slice(3, 5))
    const year = Number(start_date.slice(6, 10))

    const hours = Number(start_date.slice(11, 13))
    const minutes = Number(start_date.slice(14, 16))




    const event: EventAttributes = {
      start: [year, month, day, hours, minutes],
      duration: { hours: 1 },
      title,
      description,
      location
    }


    const filename = 'CommitteeSession.ics'
    const file: any = await new Promise((resolve, reject) => {
      createEvent(event, (error, value) => {
        if (error) {
          reject(error)
        }

        resolve(new File([value], filename, { type: 'text/calendar' }))
      })
    })
    const url = URL.createObjectURL(file);

    // trying to assign the file URL to a window could cause cross-site
    // issues so this is a workaround using HTML5
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
}


export default downloadCalendarEvent