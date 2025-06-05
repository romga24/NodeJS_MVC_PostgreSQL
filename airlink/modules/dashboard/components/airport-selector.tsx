"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAirports } from "@/modules/dashboard/services/airports"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { Airport } from "@/modules/shared/types/shared-types"
import { useTranslations } from "next-intl"

interface AirportSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}

export function AirportSelector({ value, onChange, placeholder, label }: AirportSelectorProps) {
  const [open, setOpen] = useState(false)
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const t = useTranslations()

  useEffect(() => {
    const fetchAirports = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getAirports()
        setAirports(data)
      } catch (error) {
        setError(t("dashboard.errorLoadingAirports"))
      } finally {
        setLoading(false)
      }
    }
    fetchAirports()
  }, [t])

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
      .replace(/[^a-z0-9 ]/g, " ")     // Sustituye guiones y símbolos por espacio
      .replace(/\s+/g, " ")            // Quita espacios múltiples

  const filteredAirports = airports.filter((airport) => {
    const search = normalize(searchValue)
    const nombre = normalize(airport.nombre)
    return search.length === 0 || nombre.includes(search)
  })

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Popover
        open={open}
        onOpenChange={(state) => {
          setOpen(state)
          if (!state) setSearchValue("")
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full min-w-[200px] flex items-center justify-between whitespace-normal break-words py-2 px-3"
          >
            <span className="flex-1 text-left leading-snug">
              {value
                ? airports.find((a) => a.codigo_iata === value)?.nombre || value
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder={t("dashboard.searchAirport")}
              value={searchValue}
              onValueChange={setSearchValue}
              autoFocus
            />
            <CommandList>
              {loading && <div className="py-6 text-center text-sm">{t("common.loadingAirports")}</div>}
              {error && (
                <div className="p-2">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              {!loading && !error && (
                <>
                  {filteredAirports.length === 0 && <CommandEmpty>{t("dashboard.noAirportsFound")}</CommandEmpty>}
                  <CommandGroup>
                    {filteredAirports.map((airport) => (
                      <CommandItem
                        key={airport.codigo_iata}
                        value={airport.codigo_iata}
                        onSelect={() => {
                          onChange(airport.codigo_iata)
                          setOpen(false)
                          setSearchValue("")
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === airport.codigo_iata ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {airport.nombre} ({airport.codigo_iata})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
