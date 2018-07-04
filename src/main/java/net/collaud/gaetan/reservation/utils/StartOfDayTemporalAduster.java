package net.collaud.gaetan.reservation.utils;

import java.time.temporal.ChronoField;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAdjuster;

public class StartOfDayTemporalAduster implements TemporalAdjuster {
    @Override
    public Temporal adjustInto(Temporal temporal) {
        return temporal
            .with(ChronoField.HOUR_OF_DAY, 0)
            .with(ChronoField.MINUTE_OF_HOUR, 0)
            .with(ChronoField.SECOND_OF_MINUTE, 0)
            .with(ChronoField.MILLI_OF_SECOND, 0);
    }
}
