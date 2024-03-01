import moment from "moment";


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


