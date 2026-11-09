export function getCurrentTimeString(date: Date = new Date()): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getCurrentFullTimeString(date: Date = new Date()): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function isWithinODECOShift(timeString: string = getCurrentTimeString()): boolean {
  // Turno oficial: 08:00 a 16:00
  const [h, m] = timeString.split(':').map(Number);
  const totalMinutes = h * 60 + m;
  const startMinutes = 8 * 60; // 08:00
  const endMinutes = 16 * 60; // 16:00
  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
}

export function addMinutesToTimeString(timeString: string, minutesToAdd: number): string {
  const [h, m] = timeString.split(':').map(Number);
  const total = h * 60 + m + minutesToAdd;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

export function calculateDifferenceMinutes(timeA: string, timeB: string): number {
  // Returns timeB - timeA in minutes (positive if timeB is later)
  const [hA, mA] = timeA.split(':').map(Number);
  const [hB, mB] = timeB.split(':').map(Number);
  return (hB * 60 + mB) - (hA * 60 + mA);
}

export function getLeaveTimingStatus(
  departureTime: string, 
  estimatedReturnTime: string, 
  currentTime: string = getCurrentTimeString(),
  isNoLimit: boolean = false
): {
  elapsedMinutes: number;
  remainingMinutes: number;
  isOverdue: boolean;
  overdueMinutes: number;
  formattedStatus: string;
} {
  const elapsedMinutes = Math.max(0, calculateDifferenceMinutes(departureTime, currentTime));

  if (isNoLimit || !estimatedReturnTime || estimatedReturnTime === '--:--') {
    return {
      elapsedMinutes,
      remainingMinutes: 0,
      isOverdue: false,
      overdueMinutes: 0,
      formattedStatus: `${elapsedMinutes} min transcurridos (Sin límite de tiempo)`,
    };
  }

  const diffToEstimated = calculateDifferenceMinutes(currentTime, estimatedReturnTime);

  if (diffToEstimated >= 0) {
    // Aún en tiempo
    return {
      elapsedMinutes,
      remainingMinutes: diffToEstimated,
      isOverdue: false,
      overdueMinutes: 0,
      formattedStatus: `${diffToEstimated} min restantes`,
    };
  } else {
    // Retraso / Excedido
    const overdueMinutes = Math.abs(diffToEstimated);
    return {
      elapsedMinutes,
      remainingMinutes: 0,
      isOverdue: true,
      overdueMinutes,
      formattedStatus: `Demora de ${overdueMinutes} min`,
    };
  }
}

export function formatDateSpanish(date: Date = new Date()): string {
  return date.toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
