package net.collaud.gaetan.reservation.utils;

import java.time.temporal.ChronoField;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAdjuster;

public class EndOfDayTemporalAduster implements TemporalAdjuster {
    @Override
    public Temporal adjustInto(Temporal temporal) {
        return temporal
            .with(ChronoField.HOUR_OF_DAY, 23)
            .with(ChronoField.MINUTE_OF_HOUR, 59)
            .with(ChronoField.SECOND_OF_MINUTE, 59)
            .with(ChronoField.MILLI_OF_SECOND, 999);
    }
}
