"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Checkbox,
  Spinner,
} from "flowbite-react";

// Define property interface to match the database schema
interface Property {
  id: string;
  propertyName: string;
  propertyCode: string;
  area: string | null;
  city: string | null;
  state: string | null;
  managersList: string[];
  ownersList: string[];
}

interface PropertiesTableProps {
  searchTerm: string;
  selectedProperties: string[];
  onPropertySelect: (propertyId: string, isSelected: boolean) => void;
}

export default function PropertiesTable({
  searchTerm,
  selectedProperties,
  onPropertySelect,
}: PropertiesTableProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties on component mount or when search term changes
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Fetch properties from your API endpoint
        const response = await fetch(
          `/api/properties${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter properties based on search term for client-side filtering
  const filteredProperties = properties.filter((property) => {
    if (!searchTerm) return true;

    const searchTermLower = searchTerm.toLowerCase();

    // Check property name and code
    if (
      property.propertyName.toLowerCase().includes(searchTermLower) ||
      property.propertyCode.toLowerCase().includes(searchTermLower)
    ) {
      return true;
    }

    // Check managers
    if (
      property.managersList &&
      property.managersList.some((manager) =>
        manager.toLowerCase().includes(searchTermLower),
      )
    ) {
      return true;
    }

    // Check owners
    if (
      property.ownersList &&
      property.ownersList.some((owner) =>
        owner.toLowerCase().includes(searchTermLower),
      )
    ) {
      return true;
    }

    return false;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto table-auto overflow-x-auto rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
        <Table className="w-full">
          <TableHead>
            <TableRow>
              <TableHeadCell>Select</TableHeadCell>
              <TableHeadCell>Property Name</TableHeadCell>
              <TableHeadCell>Code</TableHeadCell>
              <TableHeadCell>Area</TableHeadCell>
              <TableHeadCell>City</TableHeadCell>
              <TableHeadCell>State</TableHeadCell>
              <TableHeadCell>Managers</TableHeadCell>
              <TableHeadCell>Owners</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y overflow-x-scroll">
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-4 text-center">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={property.id}
                >
                  <TableCell>
                    <Checkbox
                      id={`property-${property.id}`}
                      checked={selectedProperties.includes(property.id)}
                      onChange={(e) =>
                        onPropertySelect(property.id, e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {property.propertyName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {property.propertyCode}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {property.area || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {property.city || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {property.state || "-"}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {property.managersList && property.managersList.length > 0
                      ? property.managersList.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {property.ownersList && property.ownersList.length > 0
                      ? property.ownersList.join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
