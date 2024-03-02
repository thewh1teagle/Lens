import moment from "moment-timezone";


export function parseDurationString(durationString: string): moment.Duration | null {
    // Regular expression to match the input format
    const durationPattern = /^(\d+)([hms])$/;

    // Match the input format
    const match = durationString.match(durationPattern);

    if (match) {
        // Extract the quantity and the unit
        const quantity = parseInt(match[1]);
        const unit = match[2];

        // Create a moment duration based on the unit
        switch (unit) {
            case 'h':
                return moment.duration(quantity, 'hours');
            case 'm':
                return moment.duration(quantity, 'minutes');
            case 's':
                return moment.duration(quantity, 'seconds');
        }
    }

    return null;
}



export function formatLabel(config: WidgetConfig, label?: string) {
    if (!label) {
      return label
    }
    if (config.x.format?.type === 'date') {
      if (config?.x?.format?.timezone) {
        if (config?.x?.format?.timezone === "local") {
          return moment(label, config.x?.format?.from).local().format(config.x?.format?.to)
        } else {
          return moment(label, config.x?.format?.from).tz(config?.x?.format?.timezone).format(config.x?.format?.to)
        }
      }
      return moment(label).format(config.x?.format?.to)
    }
    return label
}